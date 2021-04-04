const express = require('express')
const router = express.Router()
var admin = require("firebase-admin");
const firebase = require('firebase');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')
const auth = require('../auth')
const jwt = require('jsonwebtoken');
const csv = require('csvtojson');
const UUID = require("uuid-v4");

firebase.auth.Auth.Persistence.NONE;


// function for image upload
function upload(localFile, remoteFile){

    // let uuid = UUID();
    let uuid =remoteFile;
  
    return bucket.upload( localFile, {
          destination:remoteFile,
          uploadType: "media",
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens:uuid
            }
          }
        })
        .then((data) => {
  
            let file = data[0];
  
            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" +uuid);
        });
  }
 
//   video beta-test
function uploadf(localFile, remoteFile){

    // let uuid = UUID();
    let uuid =remoteFile;
  
    return bucket.upload( localFile, {
          destination:remoteFile,
          uploadType: "media",
          metadata: {
            contentType: 'video.mp4',
            metadata: {
              firebaseStorageDownloadTokens:uuid
            }
          }
        })
        .then((data) => {
  
            let file = data[0];
  
            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" +uuid);
        });
  }


// var firebaseConfig = {
//     apiKey: "AIzaSyBHd50N3vrsVyjUYUa-753UnpZQesUHHWU",
//     authDomain: "node-web-app-9a6e2.firebaseapp.com",
//     databaseURL: "https://node-web-app-9a6e2-default-rtdb.firebaseio.com",
//     projectId: "node-web-app-9a6e2",
//     storageBucket: "node-web-app-9a6e2.appspot.com",
//     messagingSenderId: "667358112659",
//     appId: "1:667358112659:web:adc2bb76a044eb6c425666",
//     measurementId: "G-4SXFPNDF2N"
//   };
var firebaseConfig = {
    apiKey: "AIzaSyBOSuJI9Vkce2BBcrLva4L60qhEhMRwBpk",
    authDomain: "share-project-58415.firebaseapp.com",
    projectId: "share-project-58415",
    storageBucket: "share-project-58415.appspot.com",
    messagingSenderId: "543506506647",
    appId: "1:543506506647:web:ebb37daff6d78a32739ad2"
  };
// Storage
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
    keyFilename: 'share-project-58415-firebase-adminsdk-atkiv-55ea822c35.json'
});
const bucket = storage.bucket("share-project-58415.appspot.com");
let filename ='flutter_IMG_20191116_141647.jpg';
let bucketName= 'share-project-58415.appspot.com';

// test start
// const downloadFile = async() => {
//     let destFilename = './tmp/flutter_IMG_20191116_141647.jpg';
//     const options = {
//       // The path to which the file should be downloaded, e.g. "./file.txt"
//       destination: destFilename,
//     };

//     // Downloads the file
//     await storage.bucket(bucketName).file(filename).download(options);

//     console.log(
//       `gs://${bucketName}/${filename} downloaded to ${destFilename}.`
//     );
//   } 

// console.log(`${filename} uploaded to ${bucketName}.`);


// downloadFile();




// test end



// const fireStorage = firebase.storage();
// var firebaseConfig = {
//     apiKey: "AIzaSyAcjPD8ncO6m_nZ5Rq18wmEspcRsNwCIvo",
//     authDomain: "test-f2508.firebaseapp.com",
//     projectId: "test-f2508",
//     storageBucket: "test-f2508.appspot.com",
//     messagingSenderId: "130015415803",
//     appId: "1:130015415803:web:60c9ef4bd4460355d2cf5e",
//     measurementId: "G-LDEE9MY75Y"
//   };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//firebase.auth.Auth.Persistence;
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const dbs = firebase.firestore();
dbs.settings({ timestampsInSnapshot: true});

// upload-file
let location='tmp/'+'work.csv';

router.post('/uploadfile', auth,async(req,res)=>{
    
// console.log(req.files.filename);
//     csv().fromStream(req.files.filename.data).then((ob)=>{
//         console.log(ob);
//         res.send("okay")
//     }).catch(err=>{
//         console.log(err);
//     })
    if(req.files){
        console.log(req.files)
        var file = req.files.filename
        var filename= file.name;
        var type = req.body.type;
        file.mv('./tmp/'+filename,async (err)=>{

            if(err){
                res.send('error occured!')
            }else{
               await dbs
               .collection(type)
               .get()
               .then((querySnapshot) => {
               querySnapshot.forEach((doc) => {
                 doc.ref.delete();
               });
             });
                location = 'tmp/'+filename;
               console.log(filename);
                csv()
                .fromFile(location)
                .then((jsonObj)=>{
                    console.log('this is : '+jsonObj);
                    let d;
                    jsonObj.forEach(async function(item){
                        
                        console.log(item);
                        d=item;
                     await   dbs.collection(type).add({
                        No:parseInt(item.No),
                        question:item.STATEMENTS
                     });

                    });
                   
                })
                res.redirect('/screen/admin');
            }
        })
        // const jsonArray = await csv().fromFile('./public/upload/'+filename);
      
    }else{
        res.redirect('/screen/admin');
    }
})



// sign-in get 
router.get('/signin',(req,res)=>{   
    res.render('screen/signin');   
});

// sign-in post
router.post('/signin', async (req,res) => {
    let  email = req.body.email;
    let password = req.body.password;
    
    
    try{
        await  firebase.auth().signInWithEmailAndPassword(email,password).then(resp=>{
        
        let currentUser = firebase.auth().currentUser.uid;
    
        let token = jwt.sign({_id :currentUser},'somerandomsecretkeywhichwillworkasmysecretkeyfortestingsite',{expiresIn:'1h'});
        

        res.cookie('jwt_cookie', token,{
        //maxAge: 6000000,
        // maxAge: 60000,
        maxAge: 60*60*6*1000,
        httpOnly: true
        //  ,secure: true
        })
            res.redirect("/screen/udmyPanel");
        })
        }
        catch(err){
        console.log(err.code); 
        res.render('screen/signin',{
            email: req.body.email,
            errorMessage: 'invalid Email or password!'
        }); 
    }

   
})


//sign-in post
// router.post('/signin',(req,res)=>{
//     let  u_email = req.body.email;
//     let u_password = req.body.password;
//     const auth = firebase.auth();
//     auth.signInWithEmailAndPassword(u_email, u_password).then(resp=>{
    
//       res.render("screen/admin-panel");
      
//     }).catch(err=>{

//         switch(err.code){
//                 case "auth/user-not-found":
//                     console.log("User not found");
                
//                     break;
//                     default:
//                         console.log("Default");
//         }
           
//     });
//     // change
//     res.redirect('/screen/signin')
// })

// signout
router.get('/signout/:signout',auth,async(req,res)=>{  
    try{
        console.log(req.params.signout);
        res.clearCookie('jwt_cookie');
        console.log('logout successfully');    
        firebase.auth().signOut();
        res.redirect('/screen/signin');
    
    }
    catch(error){
        res.status(500).send(error);
    }
});



// getting question to upload on firestore
// router.post('/admin',auth, (req,res) =>{

// let questionType = req.body.options;
// let question = req.body.question;

// if(question !== undefined && question !== '' && question.length >= 10 ){
//     var timestamp = new Date().getTime();

//     dbs.collection(questionType).add({
//         question: question,
//         timeStamp: timestamp
//     });

//     res.redirect('/screen/admin');
// }else{
  
//     res.redirect('/screen/admin');
// }
    
// })
// new better version
router.post('/writingType',auth,async(req,res)=>{
    let questionType = req.body.options;
let question = req.body.question;
// console.log(req.body);
if(question !== undefined && question !== '' && question.length >= 10 ){
    // var timestamp = new Date().getTime();
// find the eg. mySelf collection- and get its doc eg. No and then add index+1 to it. and then add.
// let number ;
// let count = 0;
// await dbs.collection(questionType).orderBy('No').get('No').then((no)=>{
//     number = no.docs;
//     number.forEach((i)=>{
//         console.log('logging questions: '+ i.data().No);
//         count= i.data().No;
//         console.log('count is: '+ count);
//     })
//     number= count++;
//     console.log('number: '+ number);
// })
var len;
let st;
dbs.collection(questionType).get().then(async snapshot => {

 len  = snapshot.size;
 len=len+1;
    console.log(len);
 
    await  dbs.collection(questionType).add({
        question: question,
        No: len
    }).then(()=>{
        res.render('screen/writingType',{type:questionType});
    });
 })



   // res.redirect('/screen/admin');
}else{
    res.redirect('/screen/admin');
}
  
})


// redirect to collection type page
router.get('/writingType/:type',auth,(req,res)=>{
    console.log(req.params.type);
    if(req.params.type == 'himSelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else if(req.params.type == 'herSelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else if(req.params.type == 'mySelf'){
        res.render('screen/writingType',{type: req.params.type})
    }
    else{
        res.redirect('/screen/admin')
    }
})




// udmy app

// udmyPanel
router.get('/udmyPanel',async(req,res)=>{
    // 
    dbs.collection('catagories').get().then((snapshot)=>{
        let courses = snapshot;
// courses.docs.forEach((test)=>{
//     console.log(test);
// })
//        
 res.render('screen/udmyPanel',{courses:courses});

    }).catch((err)=>{
        console.log('udemyPanel error Get: '+err)
    })

});

// addCourse
router.get('/addCourse', async(req,res)=>{
    // get All collections for displaying all cols
await  dbs.collection('types').get().then((snapshot)=>{
    let data= snapshot.docs;
      // get all catagories
      res.render('screen/addCourse',{catagories:data});
    
    }).catch((err)=>{
        console.log('error at /addCourse GET:'+err);
    })

  
});
router.post('/addCourse',async(req,res)=>{
    // res.send('screen/addCourse successful!');
    // file-upload
    if(req.files){
        var file = req.files.filename
        var filename= file.name;
        console.log(file)
        file.mv('tmp/'+filename,async (err)=>{
          let task = await bucket.upload(
                'tmp/'+filename, 
                {
                    destination:'collectionA/courseA/'+ filename + new Date(),
                    metadata: {
                        cacheControl: "public, max-age=315360000", 
                        contentType: "image/jpeg"
                 }
            })
        })    
        res.render('screen/udmyPanel');
    }
    // handling 
    let title= req.body.title;
    let pricing= req.body.price;
    let description= req.body.description;
    let catagory= req.body.catagory;
    let tick= req.body.bestseller?true:false;
    // let rating= req.body.rating;
    let rating= '3'
 
    console.log(req.body);
    console.log('Bestseller is: '+tick);

    await dbs.collection('catagories').add({
        timestamp:new Date(Date.now()),
        title:title,
        catagory:catagory,
        rating:rating,
        pricing:pricing,
        imgurl:'../',
        intro_video_url:'../',
        intro_video_thumbnail:'../',
        description: description,
        Best_seller:tick
        // ,content: [{
        //     icon:'../',
        //     desc:'some desc'
        // }]
    }).then(()=>{
        res.redirect('/screen/udmyPanel');
    }).catch((err)=>{
        console.log('error at addCourse POST '+err);
    })



});

// begin from here! start
// edit Leacture
router.get('/addLeacture', async (req,res)=>{

    let title= req.body.title;
    
    
    let catagory= req.body.catagory;
    let tick= req.body.bestseller?true:false;
    // let rating= req.body.rating;
    let rating= '3'
 
    console.log(req.body);
    console.log('Bestseller is: '+tick);

    await dbs.collection('catagories').add({
        timestamp:new Date(Date.now()),
        title:title,
        catagory:catagory,
        rating:rating,
        pricing:pricing,
        imgurl:'../',
        intro_video_url:'../',
        intro_video_thumbnail:'../',
        description: description,
        Best_seller:tick
        // ,content: [{
        //     icon:'../',
        //     desc:'some desc'
        // }]
    }).then(()=>{
        res.redirect('/screen/udmyPanel');
    }).catch((err)=>{
        console.log('error at addCourse POST '+err);
    })

})



// editCourse
router.get('/editCourse', async (req, res)=>{
    let courses;
    // get all catagories-for edit
    await  dbs.collection('catagories').get().then((snapshot)=>{
        courses= snapshot;
        //   get all catagories
          courses.docs.forEach((course)=>{
              console.log(course.data().title);
          })
          res.render('screen/editCourse',{courses:courses});
        
        }).catch((err)=>{
            console.log('error at /editcourse Get:'+ err);
        })
   
    }
)

// posting edit catagory here=>{ catagory }
//ps. this route isnt being used 
router.post('/catagory', async (req,res)=>{
    // edit catagory isnt working!
        let catagory = req.body.catagory;
        let replace = req.body.replace;
        console.log('collection to remove: '+catagory);
        
        await dbs.collection('catagories').doc(catagory).set({ timestamp: new Date(),
        catagory:catagory,
        
        }).then(()=>{
        res.redirect('/screen/editCourse');
        }).catch((err)=>{
            console.log('error at /catagory POST  : '+ err);
        })
    }
)

// screen/course from editsection containing section title Post
    
router.post('/course', async(req,res)=>{
    let course = req.body.course;
    let title = req.body.sectionTitle;
    console.log(req.body);
    
await dbs.collection('catagories/'+course+'/'+'content/').add({
    title:title,leacture:[{demo:true,id:new Date(),thumbnail:'../',title:'changed!'}]
},{merge:true}).then(()=>{
    res.redirect('/screen/udmypanel');
})

.catch((err) => {
    console.log('error at /course: '+ err);
})

}
)
// ====================================>

// add leacture
router.get('/add_lecture', async(req,res)=>{
    res.render('screen/add_lecture');
})

//  the lecture man here =============>

// Display leactures
router.get('/leacture/:type/:t/:title', async (req, res) => {
    let course_id = req.params.type;
    let t = req.params.t;
    let title = req.params.title;
    console.log(req.params)

    // test for adding leacture
    // const Ref = dbs.collection('catagories/'+course_id+'/content/').doc(t);
    // Ref.update({
    //         leacture: firebase.firestore.FieldValue.arrayUnion(...[{demo:true, id:new Date(),thumbnail:'../',title:'title'}])
    // });
// ....

    await dbs.collection('catagories/'+course_id+'/content/').where('title' ,'==',title).get().then((snapshot)=>{
        let section = snapshot 
        
        section.docs.forEach((o)=>{
             console.log(o.data().title);
            let sections= o.data();
             if(o.id == t ){
                 
                 res.render('screen/getLeacture',{sections:section,id:course_id});
             }
            
        })
             
        })
        
        .catch((err) => {
            console.log('error at /course: '+ err);
        })
    
})
// new feature*
// add lectures route start here
router.post('addLeacture/create',async(req,res)=>{
    console.log(req.body);
    let col_name = req.body.col_name;
    let course_name=req.body.course_name;
    let title=req.body.title;
    let demo= req.body.demo;

// get catagory id using title 
    let course_id;
await dbs.collection('catagories').where('title', '==',col_name).get().then(async(snap)=>{
    let data = snap;
    data.docs.forEach((i)=>{
        console.log(i.id)
        course_id= i.id;
    })
// get section id using title
    let sec_id;
await dbs.collection('catagories/'+course_id+'/content/').get().where('title' ,'==',course_name).get().then((snapshot)=>{
    let stuff = snapshot;
    stuff.docs.forEach((a)=>{
        console.log(a.data())
        sec_id= a.id;

        // add lectures
        const Ref = dbs.collection('catagories/'+course_id+'/content/').doc(sec_id);
        Ref.update({
                leacture: firebase.firestore.FieldValue.arrayUnion(...[{demo:true, id:new Date(),thumbnail:'../',title:title}])
        });
    })
    res.redirect('/screen/udemyPanel');
})
    
})


})
// new* feature
// adds a section comes from getCourse
router.post('/addSection/create',async(req,res)=>{
    console.log(req.body);
    let col_name = req.body.col_name;
    let title = req.body.title;
    let demo = req.body.demo;
    let course_id;
await dbs.collection('catagories').where('title','==',col_name).get().then((snap)=>{
    let sn= snap;
    sn.docs.forEach((f)=>{
        console.log(f.id);
        course_id=f.id
    })

})

   await dbs.collection('catagories/'+course_id+'/content/').add({
        title:title
    }).then(()=>{
        res.redirect('/screen/udmyPanel');
    })

})

// arrayMaps
// const Ref = dbs.collection('catagories').doc(Document);
// Ref.update({
//         content: firebase.firestore.FieldValue.arrayUnion(...[{demo:true, id:new Date(),thumbnail:'../',title:'title'}])
// });

// start working code for deleting maps in arrays
// let imgRef= dbs.collection('test').doc('6naDCnwb7oy1u5QNfeqd');

// imgRef.get().then(function(doc) {
//     if (doc.exists) {
//         console.log('trigerd');
//         imgRef.update({
//             "images": firebase.firestore.FieldValue.arrayRemove(doc.data().images[0])
//         });
//     }
// })
// .catch(function(error) {
//     console.error(error.message);
// });
// end

// Edit course to get section information
router.post('/courseSection', async(req,res)=>{
    let col_name;
    let course_id = req.body.course;
    // let title = req.body.sectionTitle;
    console.log(req.body);
    const catRef = dbs.collection('catagories').doc(course_id);
    const doc = await catRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
    //   console.log('Document data:', doc.data());
      col_name= doc.data().title;

    }  
    await dbs.collection('catagories/'+course_id+'/'+'content/').get().then((snapshot)=>{
    let sections = snapshot 
    // sections.forEach((t)=>{
    //     console.log(t.data().title);
    // })
        res.render('screen/getCourse',{sections:sections,id:course_id,col_name:col_name});
    })

    .catch((err) => {
        console.log('error at /course: '+ err);
    })
}
)


// useless route!
router.post('/editCourse', (req,res)=>{
    res.send('edit applied !')
}
)


// addCatagory
router.post('/addCatagory',async(req,res)=>{
    // res.send('added catagory!')
    let catagory = req.body.catagory;
    console.log(req.body);

    await dbs.collection('types').doc(catagory).set({ timestamp: new Date(),
    catagory:catagory
    }).then(()=>{
    res.redirect('/screen/udmyPanel');
    }).catch((err)=>{
        console.log('error at /addCatagory :'+ err);
    })
})

// upload image from edit course
router.post('/uploadImg', async (req,res)=>{
    let course = 'The complete flutter course'

    
    if(req.files){
        var file = req.files.filename
        var filename= file.name;
        var image = 'tmp/'+filename;
        console.log(file)
        file.mv('tmp/'+filename,async (err)=>{
        
        // let ref =  fireStorage.ref(course+'/'+filename)
        
        // let task = ref.put(image);
        // let task = await bucket.upload(
        //     'tmp/'+filename, 
        //     {
        //         destination:course+'/'+ filename + new Date(),
        //         metadata: {
        //             cacheControl: "public, max-age=315360000", 
        //             contentType: "image/jpeg"
        //      }
        // })
        var hell = '/flutter_'+filename

        let result= upload('tmp/'+filename, hell)
            console.log(result);
      

        // dbs.collection('categories').doc("0Op3HgbvouB3qaFxw1FP").collection("content").doc("kfEANAIBu2m7eCrPmE0T").update({
        //     lecture:kadsfljdfdlfs:{

        //     }
        // })
        // task.on('state_changed',  function(){
        //     task.snapshot.ref.getDownloadURL().then((downloadUrl)=>{
        //         console.log(downloadUrl);
        //         dbs.collections('test').doc('test').set({
        //             'testImg': downloadUrl
        //         })
        //     })
        // })

        });    
        res.redirect('/screen/udmyPanel');
    }
})


// getCategories
router.get('/GetCategories', async(req,res)=>{

    await dbs.collection("categories")
    .orderBy("date", "desc").get().then((snap)=>{
       
        let data= snap;
        res.render('screen/GetCategories',{data:data});
    });
    
});

// AddCategory
router.post('/AddCategory',async(req,res)=>{

    let title= req.body.title;

    await dbs.collection('categories').add({
        title:title,
        date:new Date()
    });
    res.redirect('/screen/GetCategories');
});

// DeleteCategory
router.get('/DeleteCategory/:title',async(req,res)=>{
    console.log(req.params);
    let title = req.params.title;

    await dbs.collection('categories').doc(title).delete();
    res.redirect('/screen/GetCategories');
})


// EditCategory
router.get('/EditCategory/:id/:title',async(req,res)=>{
    let id = req.params.id;
    let title = req.params.title;
    // take id from href and send to Edit form
    res.render('screen/EditCategory',{id:id,title:title});
})

router.post('/EditCategory',async(req,res)=>{
    console.log(req.body);
    let id= req.body.id;
    let title = req.body.title;

    await dbs.collection('categories').doc(id).update({title:title});
    res.redirect('/screen/GetCategories');
})

// GetCourses
router.get('/GetCourses',async(req,res)=>{

    await dbs.collection('courses').orderBy('timestamp','desc').get().then((snap)=>{
        let courses = snap;
         res.render('screen/GetCourses',{courses:courses});
    });
   
});

// AddCourse
router.get('/Add_Course',async(req,res)=>{

    res.render('screen/Add_Course');
});

router.post('/Add_Course',async(req,res)=>{
    let title= req.body.title;
    let uuid=UUID()
await dbs.collection('courses').add({
    timestamp: new Date(),
    id: uuid,
    title:title,
    description:'',
    bannerUrl:'',
    tag:'',
    price:0.0,
    introVideoThumbnail:'',
    introVideoThumbnailKey:'',
    introVideoUrl:'',
    rating:0,
    totalStudents:0,
    totalRatingCount:0,
    category:'',
    features:[]
    }).then(()=>{
        res.redirect('/screen/GetCourses');
    });

});

// DeleteCourse
router.get('/DeleteCourse/:id',async(req,res)=>{
    let id = req.params.id;
await dbs.collection('courses').doc(id).delete().then(()=>{
    res.redirect('/screen/GetCourses');
});

});

// /EditCourse
router.get('/Edit_Course/:id', async(req,res)=>{
    let id= req.params.id;
    // either use dbs.collection('courses').doc(id) to get data of this and send to its edit menu.

    // gets categories name
    let categories;
    // gets the course name and its existing contents
    let data;

    await dbs.collection('categories').get().then((s)=>{
        categories= s;
    })
    // categories.docs.forEach((s)=>{
    //     console.log(s.data().title);
    // })

    const catRef =await dbs.collection('courses').doc(id);
    const doc = await catRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
    //   console.log('Document data:', doc.data());
      data= doc.data();
    //   console.log(data.category);
      res.render('screen/Edit_Course',{id:id,data:data,categories:categories});

    }
    
});
router.post('/Edit_Course', async(req,res)=>{
    
    // let body= req.body;
    // console.log('sent data!:'+req.body.id);
    // console.log('whole received body: '+req.body);
    // console.log(body);
    

    let id = req.body.id;
    let title = req.body.title;
    let category = req.body.course_name;
    let description = req.body.description;
    let price = req.body.price;
    let tag = req.body.tag;
    
    // console.log(id+' :: '+title+' :: '+category+' :: '+price+' :: '+rating+' :: '+description+' :: '+tag);
    // let bannerUrl=req.body.bannerUrl;
    let boi= req.body.bannerUrl;
    let boib= req.body.bannerUrl;
    let boic= req.body.bannerUrl;
    console.log(boi);
   
    if( req.files && req.files.bannerImage !== undefined && req.files.bannerImage.mimetype === 'image/png' ||req.files.bannerImage.mimetype === 'image/jpeg'){

        var file = req.files.bannerImage;
        var filename= file.name;
        console.log(file)
        let loc= UUID();
        console.log(loc);
        file.mv('tmp/'+filename,async (err)=>{
            boi = await upload('tmp/'+filename,loc);
            console.log(boi);
            dbs.collection('courses').doc(id).update({ 
                
                bannerUrl:boi
            })
       
        })    
        
       
    } 


  if(req.files && req.files.videoThumbnail !== undefined && req.files.videoThumbnail.mimetype === 'image/png' || req.files.videoThumbnail.mimetype === 'image/jpeg'){

    setTimeout(function b(){
        var fileb = req.files.videoThumbnail;
    var filenameb=  req.files.videoThumbnail.name;
    console.log(fileb)
    let loc= UUID();
    console.log(loc);
    fileb.mv('tmp/'+filenameb,async (err)=>{
        boib = await upload('tmp/'+filenameb,loc);
        console.log(boib);
        dbs.collection('courses').doc(id).update({ 
          
            introVideoThumbnail:boib
        })
   
    }) 
    }, 2000)
    }


 //   if(req.files.video !== 'null' && req.files.video !== 'undefined'){
  if(req.files && req.files.video !== undefined && req.files.video.mimetype === 'application/octet-stream'){
    let ftype= req.files.video.mimetype;
    console.log('video type is: '+ ftype);
    setTimeout(function c(){
        
    var filec = req.files.video;
    var filenamec= req.files.video.name;
    console.log(filec)
    let loc= UUID();
    console.log(loc);
    filec.mv('tmp/'+filenamec,async (err)=>{
        boic = await uploadf('tmp/'+filenamec,loc);
        console.log(boic);
        dbs.collection('courses').doc(id).update({ 
           
            introVideoUrl:boic,
            introVideoThumbnailKey:loc
        })
   
    }) 
    }, 4000)
    }

 
    setTimeout(function u(){
        
        dbs.collection('courses').doc(id).update({ 
             title:title,
             category:category,
             description:description,
             price:price,
             tag:tag
         }).then(()=>{
             res.redirect('/screen/GetCourses');
         })
        
      },6000);
 
  
   


})
// manageFeatures
router.get('/manageFeatures/:id',async (req,res)=>{
    let id= req.params.id;


    // 

    const Ref = dbs.collection('courses').doc(id);
    const doc = await Ref.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      let features= doc.data().features;
      console.log(features);
      res.render('screen/manageFeatures',{id:id, features:features});
    } 
    // 



})
router.post('/manageFeatures',async (req,res)=>{
    let title = req.body.title;
    let id = req.body.id;
    var ty= req.files.iconImage.mimetype ;
console.log(ty);
          
    if(req.files  && req.files !== undefined && ty === 'image/jpeg' || ty === 'image/png'){
// req.filesiconImage.mimetype == 'jpg' &&

        var file = req.files.iconImage;
        var filename= file.name;
        console.log(file)
        let loc= UUID();
        console.log(loc);

        file.mv('tmp/'+filename,async (err)=>{
            boi = await upload('tmp/'+filename,loc);
            console.log(boi);
            const Ref =  dbs.collection('courses').doc(id);
            // Ref.update({
            //     features: []
            // });
           setTimeout(function aka(){
            Ref.update({
                features: firebase.firestore.FieldValue.arrayUnion(...[{ Key:loc,
                    iconUrl:boi,
                    title:title}])
            });
           },5000)
            res.redirect('/screen/GetCourses');   
            // come here!
       
        })    
       
    } 
    else{
        res.redirect('/screen/GetCourses');  
        console.log('didnt work');
    }
})

setTimeout(function sayHi() {
console.log('Hello, Mr. Universe!');
}, 2000)

// deleteFeature

router.post('/DeleteFeature', async(req,res)=>{
    let id = req.body.id;
    console.log(req.body)

 let Ref = dbs.collection('courses').doc(id);

 
            Ref.update({
                features: firebase.firestore.FieldValue.arrayRemove(...[{
                    Key: req.body.key,
 
  iconUrl: req.body.url,
  title: req.body.title
                }])
            });
           

    
    res.redirect('/screen/GetCourses');

})


// manageSections
router.get('/manageSections/:id', async(req,res)=>{
  let id = req.params.id;

  dbs.collection('courses').doc(id).collection('sections').get().then((snapshot)=>{
    let sections = snapshot;

    sections.forEach((section)=>{
        console.log(section.data());
    })
     res.render('screen/manageSections', {id:id, sections:sections})
  })

  
});
router.post('/manageSections', async(req,res)=>{
  let sections = req.body.sections;
  let id = req.body.id;
//   
console.log(req.body);
await dbs.collection('courses').doc(id).collection('sections').add({ timestamp: new Date(),
    title:sections,
    lectures:[{time:new Date()}]
    }).then(()=>{
    res.redirect('/screen/GetCourses');
    }).catch((err)=>{
        console.log('error at / : '+ err);
    })
// 
//   res.render('screen/manageSections', {id:id})
});

// GetSection

router.get('/GetSection/:id/:sectionId/:title', async(req,res)=>{
    console.log('triggered@');
    let id = req.params.id;
    let sectionId = req.params.sectionId;
    let title = req.params.title;
    let temp;
    await dbs.collection('courses/'+id+'/sections/').where('title','==',title).get().then((snapshot)=>{
        let section = snapshot;
   
        section.docs.forEach(doc => {
            console.log(doc.data().lectures);
             temp= doc.data().lectures
        })

        res.render('screen/GetSection',{sectionId:sectionId,id:id,sections:section,temp:temp});
        }).catch((err)=>{
            console.log('error at / : '+ err);
        })


        router.post('/AddLec', async(req,res)=>{
            let id = req.body.id;
            let leacture = req.body.leacture;
            let sec_id = req.body.sectionId;
            let u= UUID();
            // if demo is false then put in lecs
            const Ref = dbs.collection('courses/'+id+'/sections/').doc(sec_id);
                    Ref.update({
                            lectures: firebase.firestore.FieldValue.arrayUnion(...[{id:u,lectureThumbnail:'../',lectureVideoUrl:'../',title:leacture}])
                    });
                    res.redirect('/screen/GetCourses');
            // 
        })

// deleteSection
router.get('/deleteSection/:id/:sec_id', (req,res)=>{
    let sec_id= req.params.sec_id
    let id= req.params.id
    const Ref = dbs.collection('courses/'+id+'/sections/').doc(sec_id);
    Ref.delete();
    res.redirect('/screen/GetCourses');

})
// the editing of lecture
    router.get('/Edit_Lecture/:id/:sec_id/:lec_id/:lec_title', async(req,res)=>{
        console.log(req.params);
        let id = req.params.id;
        let sec_id= req.params.sec_id;
        let lec_id =req.params.lec_id;
        let lec_title= req.params.lec_title;
        let Ref = dbs.collection('courses/'+id+'/sections').get(sec_id);
        Ref.then((snap)=>{
            if(!snap){
                console.log('no doc');
            }else{
                snap.docs.forEach((doc)=>{
                    console.log(doc.data());
                })
            }
        })
        res.render('screen/Edit_Lecture',{id:id, title:lec_title,sec_id:sec_id})
    }) 


    
router.post('/Edit_Lecture', async(req,res)=>{
    console.log(req.body);
    let id =req.body.id;
    let sec_id= req.body.sec_id;
    let title= req.body.sec_id;

    res.send('working')

    var fileb;
    var filenameb;
    let loac;
    let boib;

    // 2nd
    let boic;
    var filec ;
    var filenamec;
    let location;

if(req.files && req.files.thumbnailUrl !== undefined && req.files.thumbnailUrl.mimetype === 'image/png' || req.files.thumbnailUrl.mimetype === 'image/jpeg'){

    setTimeout(function pic(){
        fileb = req.files.thumbnailUrl;
        filenameb=  req.files.thumbnailUrl.name;
    console.log(fileb)
       loac= UUID();
    console.log(loac);
    fileb.mv('tmp/'+filenameb,async (err)=>{
        boib = await upload('tmp/'+filenameb,loac);
        console.log(boib);
        dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({
          
            lectures: firebase.firestore.FieldValue.arrayUnion(...[{
                id:loac,
                lectureThumbnail:boib,
                id:id,
                title:title,
              //   lectureThumbnail:lectureThumbnail,
      
              }])
        })
   
    }) 
    }, 10)
    }


if(req.files && req.files.lectureVideoUrl !== undefined && 'application/octet-stream'){

    setTimeout(function b(){
        
        filec = req.files.lectureVideoUrl;
        filenamec=  req.files.lectureVideoUrl.name;
    console.log(filec)
    location= UUID();
    console.log(location);
    filec.mv('tmp/'+filenamec,async (err)=>{
        boic = await uploadf('tmp/'+filenamec,location);
        console.log(boic);
        dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({
            lectures: firebase.firestore.FieldValue.arrayUnion(...[{
                id:id,
                title:title,
                lectureVideoKey:location,
                lectureVideoUrl:boic            
      
              }]) 
         
        })
   
    }) 
    },2400)
    }
   

// 


    // for title change
  setTimeout(function live(){
    let ref = dbs.collection('courses/'+id+'/sections/').doc(sec_id);
    ref.update({
        lectures: firebase.firestore.FieldValue.arrayUnion(...[{
          id:id,
          title:title,
        //   lectureThumbnail:lectureThumbnail,

        }])
    });
  },4000)

    // 

})
// Delete_Lecture/
router.get('/Delete_Lecture/:id/:sec_id/:title', (req, res) => {
    console.log(req.params);
    let id = req.params.id;
    let sec_id= req.params.sec_id;
    let titele = req.params.title;

    console.log('ok in delete_lecture');

    setTimeout(function live(){
        let ref = dbs.collection('courses/'+id+'/sections/');
        ref.get(sec_id).then((sn)=>{
            let data= sn;
            data.docs.forEach((a)=>{
                console.log(a.data().title);
                
            })
        })

        // ref.update({
        //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
        //       id:id,
        //       title:title,
        //     //   lectureThumbnail:lectureThumbnail,
    
        //     }])
        // });
      },4000)
})

// Lecture_form_delete use later
// router.post('/Lecture_form_delete', (req,res)=>{
//     let id = req.body.id;
//     let title = req.body.title;
//     let inner_id = req.body.inner_id;
//     let section_id = req.body.section_id;
//     let lectureThumbnail = req.body.lectureThumbnail;
//     let lectureVideoUrl= req.body.lectureVideoUrl;
//     let ref = dbs.collection('courses/'+id+'/sections/').doc(section_id);
//      ref.update({
//             lectures: firebase.firestore.FieldValue.arrayRemove(...[{
//               id:inner_id,
//               title:title,
//               lectureThumbnail:lectureThumbnail,
//               lectureVideoUr:lectureVideoUrl
//             }])
//         });
//         res.redirect('/screen/GetCourses');
// })
// <%=section.data().title%>
// <% let store= section.data()%>
// <% store.forEach((item)=>{%>
//     <% console.log(item) %>
// <%})%>
// <form action="/screen/Lecture_form_delete" method="post">
//     <input type="hidden" name='id' value="<%= id %>">
//     <input type="hidden" name='title' value="<%= section.data().title %>">
//     <input type="hidden" name='inner_id' value="<%=section.data().id %>" />
//     <input type="hidden" name='section_id' value="<%= sectionId %>">
//     <input type="hidden" name='lectureThumbnail' value="<%= section.data().lectureThumbnail %>">
//     <input type="hidden" name='lectureVideoUrl' value="<%= section.data().lectureVideoUrl %>">
//     <button type="submit" class="btn btn-danger">Delete</button>
// </form>


// 
        // let ref = dbs.collection('courses/'+id+'/sections/').doc(sec_id);
        // ref.update({
        //     features: firebase.firestore.FieldValue.arrayUnion(...[{
        //       id:
        //     }])
        // });


// 


        
// rewrite this shit use tommrow
// await dbs.collection('courses/'+id+'/'+'content/').where('title' ,'==',title).get().then((snapshot)=>{
//     let section = snapshot 
    
//     section.docs.forEach((o)=>{
//          console.log(o.data().title);
//         let sections= o.data();
//          if(o.id == t ){
             
//             //  res.render('screen/GetSection',{sections:sections,id:id});
//          }
        
//     })
         
//     })
    
    // .catch((err) => {
    //     console.log('error at /course: '+ err);
    // })

// 

})


module.exports = router

// download image and upload to specific collections setting url for specific vid .or img

// create, edit and delete leactures  array in maps


// solution:

//set front end for adding leacture Name, title, and image.url// (upload for now)  

// 


// let person = [
//     {
//         name:'aftab',
//         id:'02',
//     },
//     {
//         name:'aftab',
//         id:'02',
//     }
// ]


    
// use this to write lec
// router.post('addLeacture/create',async(req,res)=>{
//     console.log(req.body);
//     let col_name = req.body.col_name;
//     let course_name=req.body.course_name;
//     let title=req.body.title;
//     let demo= req.body.demo;

// // get catagory id using title 
//     let course_id;
// await dbs.collection('catagories').where('title', '==',col_name).get().then(async(snap)=>{
//     let data = snap;
//     data.docs.forEach((i)=>{
//         console.log(i.id)
//         course_id= i.id;
//     })
// // get section id using title
//     let sec_id;
// await dbs.collection('catagories/'+course_id+'/content/').get().where('title' ,'==',course_name).get().then((snapshot)=>{
//     let stuff = snapshot;
//     stuff.docs.forEach((a)=>{
//         console.log(a.data())
//         sec_id= a.id;

//         // add lectures
//         const Ref = dbs.collection('catagories/'+course_id+'/content/').doc(sec_id);
//         Ref.update({
//                 leacture: firebase.firestore.FieldValue.arrayUnion(...[{demo:true, id:new Date(),thumbnail:'../',title:title}])
//         });
//     })
//     res.redirect('/screen/udemyPanel');
// })
    
// })


// })