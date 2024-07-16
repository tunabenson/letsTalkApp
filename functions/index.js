
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Perspective = require('perspective-api-client');

admin.initializeApp();
const db = admin.firestore();

const perspective = new Perspective({apiKey: functions.config().perspective.api_key});



const { TextServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');

const palmClient = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(functions.config().palm.api_key),
});

exports.BiasEvaluation= functions.firestore
  .document('posts/{postId}')
  .onCreate(async (change, context) => {
    if(!change.after.data().usePoliticalAnalysis){
      return null;
    }
    const newValue = change.after.data();
    if(change.before.get('text')===change.after.get('text'))return;
    // Check if the document was created or updated and contains the 'text' field
    if (!newValue || !newValue.text) {
      console.log('No text field found or document was deleted');
      return;
    }

    const { text } = newValue;

    // Construct a custom prompt
    const customPrompt = `Define the political views for the text below? 
Options: 
-left
 -center
 -right

Please print each category name along with a number from 0-1000 indicating the strength of that category. 
format exactly like this:  "right:x, center:y, left:z "

Text: ${text}

you may use context clues like the forum name:${newValue.forum} to evaluate this
`;

    try {
      // Call the PaLM API
      const [response] = await palmClient.generateText({

        model:'models/text-bison-001',
        prompt: {
          text: customPrompt,
        },
        temperature: 0.3, 
        candidateCount: 3, 
      });

      const generatedText = response.candidates[2].output;
      
      if(generatedText){
        const biasEvaluation = {};
        generatedText.split(',').forEach(pair => {
          const [key, value] = pair.split(':').map(part => part.trim());
          biasEvaluation[key] = parseFloat(value);
        });
        await change.after.ref.update({ generatedText, biasEvaluation});
    }
    else{ 
        await change.after.ref.update({generatedText:'not related'});
    }
    
      // Update the Firestore document with the generated text
    

      console.log('Document updated with generated text:', generatedText);
    } catch (error) {
      console.error('Error generating text with PaLM API:', error);
    }
  });




  exports.createPost = functions
  .runWith({
    timeoutSeconds: 540,
    enforceAppCheck:true,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {
    const currentUser = context.auth; 
    if (!currentUser) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const text = data.text;
    
    // Check toxicity
    try {
      const result = await perspective.analyze(text, {attributes: ['toxicity', 'IDENTITY_ATTACK', 'INSULT', 'THREAT']});
      for (const [key, value] of Object.entries(result.attributeScores)) {
        if (value?.summaryScore?.value >= 0.7) {
          return {header: 'Declined', message: 'Sorry, your post does not meet our community guidelines, please rewrite before posting'};
        }
      }
    } catch (error) {
      console.error('Error evaluating toxicity:', error.message); 
      throw new functions.https.HttpsError('internal', 'Error evaluating toxicity.');
    }
    
    // Check if post is related to forum topic
const customPrompt = `identify whether or not the text below is relevant and contributing to mature discussion to the forum below?

Options:
-yes
-no
Please print ONLY one category
Text: ${text}
Forum: ${data.forum}`;

    try {
      // Call the PaLM API
      const [response] = await palmClient.generateText({
        model: 'models/text-bison-001', // Use your specific model
        prompt: {
          text: customPrompt,
        },
        temperature: 0.2, // Adjust temperature as needed
        candidateCount: 1, // Number of responses to generate
      });

      // Extract the generated text from the API response
      const generatedText = response.candidates[0]?.output;

      if (!generatedText || generatedText.trim() === 'no') {
        return {header: 'Declined', message: 'Sorry, your post is either not contributing or irrelevant to the forum'};
      }
    } catch (error) {
      console.error('Error with PaLM:', error.message);
      throw new functions.https.HttpsError('internal', 'Error with relevance check.');
    }

    // Add post to the database
    try {
      
      await db.collection(data.path).add({
        ...data,
        likeCount: 0,
        dislikeCount: 0,
        date: admin.firestore.Timestamp.now()
      });
      return {header: 'Success', message: `Your post has been uploaded to the forum ${data?.forum}`};
    } catch (error) {
      console.error('Error saving post:', error.message);
      throw new functions.https.HttpsError('internal', 'Error saving post.');
    }
  });








const firebase_tools = require('firebase-tools');
const { getAuth } = require('firebase-admin/auth');


exports.deletePost = functions
  .runWith({
    enforceAppCheck:true,
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {
    const { postId } = data;
    const currentUser = context.auth;
    const user= (await getAuth().getUser(currentUser.token.uid));
   
    // Check if the user is authenticated
    if (!currentUser) {
      throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // Reference to the post in Firestore
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    // Check if the post exists
    if (!postDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Post not found.');
    }

    const post = postDoc.data();

    // Check if the current user is the owner of the post
    if (post.username !==  user.displayName) {
      throw new functions.https.HttpsError('permission-denied', `User does not have permission to delete this post.${user.displayName}`);
    }

    // Delete the post and all its subcollections

    await firebase_tools.firestore
      .delete(postRef.path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        force: true,
        token: functions.config().fb.token,
      });

    return { message: 'Post and all subcollections deleted successfully' };
  });





exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;
  const displayName = user.displayName;

  try {
    // Generate email verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Create email content
    const mailOptions = {
      from: null, //TODO: change this
      to: email,
      subject: 'Glad to see you here!',
      html: `
        <h1>Welcome, ${displayName || 'Valued User'}!</h1>
        <p>We're thrilled to have you with us. Thank you for signing up! We can't wait for you to explore all that our platform has to offer. To get started, please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you didn't sign up for this account, please ignore this email.</p>

      `
    };

    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
    
      auth: {
        
        user: null, //TODO: replace this
        pass: null //TODO: replace this
      },
    });

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);

  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
});







const sharp = require('sharp');
const storage = admin.storage();

exports.resizeImage = functions.https.onCall(async (data, context) => {
    if (!data || !data.image) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an "image" field.');
    }

    const base64Image = data.image;
    const buffer = Buffer.from(base64Image, 'base64');

    try {
        // Resize the image to 200x200 pixels
        const resizedImageBuffer = await sharp(buffer)
            .resize(200, 200)
            .toBuffer();

        // Generate a unique file name
        const filename = `${context.auth.token.uid}.png`;

        // Define the destination bucket and file path
        const bucket = storage.bucket('gs://letstalk-e7a23.appspot.com');
        const file = bucket.file(`profilepic/${filename}`);

        // Upload the resized image to Cloud Storage
        await file.save(resizedImageBuffer, {
            metadata: {
                contentType: 'image/png',
            },
        });

        
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500', 

        });
        await admin.firestore().collection('users').doc(context.auth.token.uid).update({"url": url})

    } catch (error) {
        
        throw new functions.https.HttpsError('unknown', `Error processing image: ${error.message}`);
    }
});



//we use these agents for web scraping, use multiple to avoid getting blocking. 
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0",
  "Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85.0.4183.109 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0"
];

const parser = require('html-metadata-parser');

exports.getArticleTitle=functions.https.onCall(async (data, context)=>{
  try {
    const agent=userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const result = await parser.parse(data.url, {headers:
          {'User-Agent': agent,
}});




    const title = result.meta.title; // Access title from meta data
    let imageUrl = null;

    // Try to get the image URL from Open Graph data if available
    if (result.og && result.og.image) {
      imageUrl = result.og.image;
      return { title, imageUrl };
    }

    return { title };
  
  } catch (error) {
    console.error('Failed to retrieve metadata:', error);
    return {title:'unable to display article at this moment.',};
  }
}
);
exports.checkUsernameAndEmailAvailability = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const username = data.username;

  if (!email || !username) {
      throw new functions.https.HttpsError('invalid-argument', 'Email and username must be provided.');
  }

  let emailExists = false;
  try {
      const userRecord = await admin.auth().getUserByEmail(email);
      if (userRecord) {
          emailExists = true;
      }
  } catch (error) {
      if (error.code !== 'auth/user-not-found') {
          throw new functions.https.HttpsError('internal', 'Error checking email availability.');
      }
  }

  // Check if username exists in Firestore in authentication service
  const usernameQuerySnapshot = await db.collection('users').where('username', '==', username).get();
  const usernameExists = !usernameQuerySnapshot.empty;

  return {
      emailExists: emailExists,
      usernameExists: usernameExists
  };

});

// const { onCustomEventPublished }= require('firebase-functions/v2/eventarc');
// exports.onImageResized = onCustomEventPublished('firebase.extensions.storage-resize-images.v1.complete',
// (event) => {
//   console.log(event);
// }
// );
