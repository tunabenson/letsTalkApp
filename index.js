
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Perspective = require('perspective-api-client');

admin.initializeApp();
const db = admin.firestore();

const perspective = new Perspective({apiKey: functions.config().perspective.api_key});


exports.createPost= functions
.runWith({
  timeoutSeconds: 540,
  memory: '2GB',
})
.https.onCall(async (data, context) => {
  const currentUser = context.auth; 
  // Check if the user is authenticated
  if (!currentUser) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }


  const text = data.text;
  const result = await perspective.analyze(text, {attributes:['toxicity', 'IDENTITY_ATTACK', 'INSULT', 'THREAT']});
  for(const [key, value] of Object.entries(result.attributeScores)){
    if(value?.summaryScore?.value>=0.7){
        return {header:'Declined' ,message: 'Sorry, your post does not meet our commmunity guidlines, please rewrite before posting'};
    }
}
  await db.collection('posts').add({...data, likeCount:0, dislikeCount:0, date: admin.firestore.Timestamp.now()});
  return {header:'Success' ,message: `Your post has been uploaded to the forum ${data?.forum}`};
  // no flags have been triggered
  
});





const firebase_tools = require('firebase-tools');
const { getAuth } = require('firebase-admin/auth');
const { user } = require('firebase-functions/v1/auth');


exports.deletePost = functions
  .runWith({
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
      from: 'katz.ofek23@gmail.com',
      to: email,
      subject: 'Glad to see you here!',
      html: `
        <h1>Welcome, ${displayName || 'Valued User'}!</h1>
        <p>We're thrilled to have you with us. Thank you for signing up! We can't wait for you to explore all that our platform has to offer. To get started, please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you didn't sign up for this account, please ignore this email.</p>

      `
    };

    // Send email using an email service (e.g., SendGrid, Nodemailer)
    // Here we'll use Nodemailer for example:
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
    
      auth: {
        
        user: 'katz.ofek23@gmail.com',
        pass: 'Benson1029',
      },
    });

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);

  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
});


// File: functions/index.js


// exports.processBiasEvaluation = functions.firestore
//     .document('posts/{docId}')
//     .onUpdate(async(change, context) => {
//         const newValue = change.after.data();
//         const docRef = change.after.ref;

//         // Check if BiasEvaluation exists
//         if (newValue.BiasEvaluation) {
//             const biasEvaluation = newValue.BiasEvaluation;

//             // Assuming biasEvaluation is a string like "left:x, center:y, right:z"
//             const biasMap = {};
//             biasEvaluation.split(', ').forEach(item => {
//                 const [key, value] = item.split(':');
//                 biasMap[key] = parseFloat(value);
//             });
            
//             // Prepare update object
//             const updateData = {
//                 BiasMap: biasMap
                
//             };

//             // Remove original BiasEvaluation and other fields
//             const fieldsToRemove = ['BiasEvaluation', 'safetyMetadata', 'status'];
//             fieldsToRemove.forEach(field => {
//                 updateData[field] = admin.firestore.FieldValue.delete();
//             });

//             // Update the document
//             await docRef.update(updateData);
//         } else {
//             return null;
//         }
//     });

    exports.addLikeOnChange = functions.firestore
        .document('posts/{postId}/likes/{likesId}')
        .onWrite(async (change, context) => {
            const postId = context.params.postId;
    
            const postRef = admin.firestore().collection('posts').doc(postId);
    
            let increment;
            if (!change.before.exists) {
                increment = admin.firestore.FieldValue.increment(1);
            } else if (!change.after.exists) {
                increment = admin.firestore.FieldValue.increment(-1);
            } else {
                return null;
            }
    
            try {
                await postRef.update({ likeCount: increment });
    
                console.log(`Post ${postId} updated with increment: ${increment}`);
    
                return null;
            } catch (error) {
                console.error(`Error updating like count for post ${postId}:`, error);
                return null;
            }
        });
    

        exports.addDislikeOnChange = functions.firestore
        .document('posts/{postId}/dislikes/{likesId}')
        .onWrite(async (change, context) => {
            const postId = context.params.postId;
    
            const postRef = admin.firestore().collection('posts').doc(postId);
    
            let increment;
            if (!change.before.exists) {
                increment = admin.firestore.FieldValue.increment(1);
            } else if (!change.after.exists) {
                increment = admin.firestore.FieldValue.increment(-1);
            } else {
                return null;
            }
    
            try {
                await postRef.update({ dislikeCount: increment });
    
                console.log(`Post ${postId} updated with increment: ${increment}`);
    
                return null;
            } catch (error) {
                console.error(`Error updating dislike count for post ${postId}:`, error);
                return null;
            }
        });
    


const { TextServiceClient } = require('@google-ai/generativelanguage');
const { GoogleAuth } = require('google-auth-library');
const { Timestamp } = require('firebase-admin/firestore');

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(functions.config().palm.api_key),
});

exports.BiasEvaluation= functions.firestore
  .document('posts/{postId}')
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    if(change.before.get('text')===change.after.get('text'))return;
    // Check if the document was created or updated and contains the 'text' field
    if (!newValue || !newValue.text) {
      console.log('No text field found or document was deleted');
      return;
    }

    const { text } = newValue;

    // Construct a custom prompt
    const customPrompt = `generate a set of 3 floating point numbers from 0-100 labelled: (left, center, right) representing percents. output as "left: x, center:y, right:z" by evaluating the political bias and view of the following text:" ${text}". if it is not related to politics you may output: "not related" `;

    try {
      // Call the PaLM API
      const [response] = await client.generateText({

        model:'models/text-bison-001', // Use your specific model
        prompt: {
          text: customPrompt,
        },
        temperature: 0.4, // Adjust temperature as needed
        candidateCount: 1, // Number of responses to generate
      });

      // Extract the generated text from the API response
      const generatedText = response.candidates[0].output;
      
      if(generatedText && generatedText!=='not related'){
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

