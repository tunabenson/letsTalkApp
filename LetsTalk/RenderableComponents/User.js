class User{
    constructor(username,interests,bio, accountCreated, name, uid ){
        this.bio=bio;
        this.interests=interests;
        this.username=username;
        this.lastActive=lastActive;
        this.name=name;
    }

    // const renderAccountPage=()=>{

    // }

}
const userConverter={
    toFirestore:(user)=>{
        return{
            bio: user.bio,
            interests:user.interests,
            username: user.username,
            lastActive:user.lastActive,
        }
    },
    fromFirestore:(snapshot, options)=>{
        const data= snapshot.data(options);
        return new User(data.bio, data.interests, data.username, data.lastActive)
    }
}


