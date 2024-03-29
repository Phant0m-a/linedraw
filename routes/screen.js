const express = require('express')
const router = express.Router()
var admin = require("firebase-admin");
const firebase = require('firebase');
const fStorage = require('firebase/storage');
// const firebase = require("firebase/app");
const firestore = require('firebase/firestore')
const auth = require('../auth')
const jwt = require('jsonwebtoken');
// const csv = require('csvtojson');
const UUID = require("uuid-v4");
const fs = require('fs');


firebase.auth.Auth.Persistence.NONE;


// function for image upload
function upload(localFile, remoteFile) {

    // let uuid = UUID();
    let uuid = remoteFile;
    let path = localFile;
    return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
            contentType: 'image/png',
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    })
        .then((data) => {
            try {
                console.log('in unsync ---->');
                fs.unlinkSync(path)
            } catch (err) {
                console.log(err);
            }
            let file = data[0];

            console.log('ok thats file name:<><><><><><><><><><>******');
            console.log(file.name + '***********' + uuid);
            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);

        });
}

//   video uploader
function uploadf(localFile, remoteFile) {
    let path = localFile;
    // let uuid = UUID();
    let uuid = remoteFile;

    return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
            contentType: 'video.mp4',
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    })
        .then((data) => {
            try {
                console.log('in unsync ---->');
                fs.unlinkSync(path)
            } catch (err) {
                console.log(err);
            }

            let file = data[0];

            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid);
        });
}



//firebase delete function
const deleteImages = async ({ downloadUrl }) => {
    const httpsRef = firebase.storage().refFromURL(downloadUrl).fullPath;
    return await bucket
        .file(httpsRef)
        .delete()
        .then(() => "success")
        .catch((error) => "error: " + error)
}

//mine config
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

//not mine
//var firebaseConfig = {
 //   apiKey: "AIzaSyBOSuJI9Vkce2BBcrLva4L60qhEhMRwBpk",
  //  authDomain: "share-project-58415.firebaseapp.com",
    //projectId: "share-project-58415",
    //storageBucket: "share-project-58415.appspot.com",
    //messagingSenderId: "543506506647",
    //appId: "1:543506506647:web:ebb37daff6d78a32739ad2"
//};
//mine config 
const firebaseConfig = {
  apiKey: "AIzaSyBHd50N3vrsVyjUYUa-753UnpZQesUHHWU",
  authDomain: "node-web-app-9a6e2.firebaseapp.com",
  databaseURL: "https://node-web-app-9a6e2-default-rtdb.firebaseio.com",
  projectId: "node-web-app-9a6e2",
  storageBucket: "node-web-app-9a6e2.appspot.com",
  messagingSenderId: "667358112659",
  appId: "1:667358112659:web:35b94753d2bbb57d425666",
  measurementId: "G-475VCSE6PD"
};
// Storage
const { Storage } = require('@google-cloud/storage');
const { log } = require('console');

// Creates a client
const storage = new Storage({
    keyFilename: 'share-project-58415-firebase-adminsdk-atkiv-55ea822c35.json'
});
const bucket = storage.bucket("share-project-58415.appspot.com");
let filename = 'flutter_IMG_20191116_141647.jpg';
let bucketName = 'share-project-58415.appspot.com';

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
// bucket.ref('4440580b-7001-4993-9bc1-d955cd3489b9').delete();



//firebase.auth.Auth.Persistence;
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const dbs = firebase.firestore();
dbs.settings({ timestampsInSnapshot: true });

// upload-file
// let location = 'tmp/' + 'work.csv';

// router.post('/uploadfile', auth, async (req, res) => {

//     // console.log(req.files.filename);
//     //     csv().fromStream(req.files.filename.data).then((ob)=>{
//     //         console.log(ob);
//     //         res.send("okay")
//     //     }).catch(err=>{
//     //         console.log(err);
//     //     })
//     if (req.files) {
//         console.log(req.files)
//         var file = req.files.filename.name
//         var filename = file.name;
//         var type = req.body.type;
//         file.mv('./tmp/' + filename, async (err) => {

//             if (err) {
//                 res.send('error occured!')
//             } else {
//                 await dbs
//                     .collection(type)
//                     .get()
//                     .then((querySnapshot) => {
//                         querySnapshot.forEach((doc) => {
//                             doc.ref.delete();
//                         });
//                     });
//                 location = 'tmp/' + filename;
//                 console.log(filename);
//                 csv()
//                     .fromFile(location)
//                     .then((jsonObj) => {
//                         console.log('this is : ' + jsonObj);
//                         let d;
//                         jsonObj.forEach(async function (item) {

//                             console.log(item);
//                             d = item;
//                             await dbs.collection(type).add({
//                                 No: parseInt(item.No),
//                                 question: item.STATEMENTS
//                             });

//                         });

//                     })
//                 res.redirect('/screen/admin');
//             }
//         })
//         // const jsonArray = await csv().fromFile('./public/upload/'+filename);

//     } else {
//         res.redirect('/screen/admin');
//     }
// })



// sign-in get 
router.get('/signin', async (req, res) => {

    // delete image from storage
    // const downloadUrl =  "https://firebasestorage.googleapis.com/v0/b/share-project-58415.appspot.com/o/0e531efb-7ea1-44d9-bc98-dae4c362bd54?alt=media&token=0e531efb-7ea1-44d9-bc98-dae4c362bd54";

    // //firebase delete function
    // const deleteImages = async ({ downloadUrl }) => {
    //     const httpsRef = firebase.storage().refFromURL(downloadUrl).fullPath;
    //     return await bucket
    //         .file(httpsRef)
    //         .delete()
    //         .then(() => "success")
    //         .catch((error) => "error: " + error)
    // }

    // //call the deleteImages inside async function
    // const deleteStatus = await deleteImages({ downloadUrl: downloadUrl });
    // console.log(deleteStatus)  //=> "success"


    res.render('screen/signin');
});

// sign-in post
router.post('/signin', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;


    try {
        await firebase.auth().signInWithEmailAndPassword(email, password).then(resp => {

           if(email == 'admin@admin.com'){
            let currentUser = firebase.auth().currentUser.uid;

            let token = jwt.sign({ _id: currentUser }, 'somerandomsecretkeywhichwillworkasmysecretkeyfortestingsite', { expiresIn: '1h' });


            res.cookie('jwt_cookie', token, {
                //maxAge: 6000000,
                // maxAge: 60000,
                maxAge: 60 * 60 * 6 * 1000,
                httpOnly: true
                //  ,secure: true
            })
            res.redirect("/screen/udmyPanel");
           }else{
               res.redirect("/screen/signin");
           }
            
        })
    }
    catch (err) {
        console.log(err.code);
        res.render('screen/signin', {
            email: req.body.email,
            errorMessage: 'invalid Email or password!'
        });
    }


})

// ====================================>
// udmy app

// udmyPanel
router.get('/udmyPanel',auth ,async (req, res) => {
    // 
    dbs.collection('catagories').get().then(async(snapshot) => {
        let courses = snapshot;
        let count=0;    
        //total sales
        let sales=await dbs.collection('enrolledCourses').get();
        sales.docs.forEach((i)=>{
            count=count+1;
        })
        res.render('screen/udmyPanel', { courses: courses, count:count });

       

    }).catch((err) => {
        console.log('udemyPanel error Get: ' + err)
    })

});


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









//================================================================================================== 
//================================================================================================== 








// addCatagory
router.post('/addCatagory',auth, async (req, res) => {
    // res.send('added catagory!')
    let catagory = req.body.catagory;
    console.log(req.body);

    await dbs.collection('types').doc(catagory).set({
        timestamp: new Date(),
        catagory: catagory
    }).then(() => {
        res.redirect('/screen/udmyPanel');
    }).catch((err) => {
        console.log('error at /addCatagory :' + err);
    })
})

// upload image from edit course (not being used)
// router.post('/uploadImg', async (req, res) => {
//     let course = 'The complete flutter course'


//     if (req.files) {
//         var file = req.files.filename
//         var filename = file.name;
//         var image = 'tmp/' + filename;
//         console.log(file)
//         file.mv('tmp/' + filename, async (err) => {

//             // let ref =  fireStorage.ref(course+'/'+filename)

//             // let task = ref.put(image);
//             // let task = await bucket.upload(
//             //     'tmp/'+filename, 
//             //     {
//             //         destination:course+'/'+ filename + new Date(),
//             //         metadata: {
//             //             cacheControl: "public, max-age=315360000", 
//             //             contentType: "image/jpeg"
//             //      }
//             // })
//             var hell = '/flutter_' + filename

//             let result = upload('tmp/' + filename, hell)
//             console.log(result);


//             // dbs.collection('categories').doc("0Op3HgbvouB3qaFxw1FP").collection("content").doc("kfEANAIBu2m7eCrPmE0T").update({
//             //     lecture:kadsfljdfdlfs:{

//             //     }
//             // })
//             // task.on('state_changed',  function(){
//             //     task.snapshot.ref.getDownloadURL().then((downloadUrl)=>{
//             //         console.log(downloadUrl);
//             //         dbs.collections('test').doc('test').set({
//             //             'testImg': downloadUrl
//             //         })
//             //     })
//             // })

//         });
//         res.redirect('/screen/udmyPanel');
//     }
// })


// getCategories
router.get('/GetCategories',auth, async (req, res) => {

    await dbs.collection("categories")
        .orderBy("date", "desc").get().then((snap) => {

            let data = snap;
            res.render('screen/GetCategories', { data: data });
        });

});

// AddCategory
router.post('/AddCategory',auth, async (req, res) => {

   if(firebase.auth().currentUser){
    let title = req.body.title;

    await dbs.collection('categories').add({
        title: title,
        date: new Date()
    });
    res.redirect('/screen/GetCategories');
   }else{
       res.redirect('/screen/signin')
   }
});

// DeleteCategory
router.get('/DeleteCategory/:title',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 console.log(req.params);
    let title = req.params.title;

    await dbs.collection('categories').doc(title).delete();
    res.redirect('/screen/GetCategories');
    }else{
        res.redirect('/screen/signin')
    }
   
})


// EditCategory
router.get('/EditCategory/:id/:title',auth, async (req, res) => {
    if(firebase.auth().currentUser){
let id = req.params.id;
    let title = req.params.title;
    // take id from href and send to Edit form
    res.render('screen/EditCategory', { id: id, title: title });
    }else{
        res.redirect('/screen/signin')
    }
    
})

router.post('/EditCategory',auth, async (req, res) => {
    if(firebase.auth().currentUser){
console.log(req.body);
    let id = req.body.id;
    let title = req.body.title;

    await dbs.collection('categories').doc(id).update({ title: title });
    res.redirect('/screen/GetCategories');
    }else{
        res.redirect('/screen/signin')
    }
    
})

// GetCourses
router.get('/GetCourses',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 await dbs.collection('courses').orderBy('timestamp', 'desc').get().then((snap) => {
        let courses = snap;
        res.render('screen/GetCourses', { courses: courses });
    });

    }else{
        res.redirect('/screen/signin')
    }

   
});

// AddCourse
router.get('/Add_Course',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 res.render('screen/Add_Course');
    }else{
        res.redirect('/screen/signin')
    }
   
});

router.post('/Add_Course',auth, async (req, res) => {
    if(firebase.auth().currentUser){
let title = req.body.title;
    let uuid = UUID()
    await dbs.collection('courses').add({
        timestamp: new Date(),
        id: uuid,
        title: title,
        description: '',
        bannerUrl: '',
        tag: '',
        oldPrice: '',
        price: '',
        demoVideos: [],
        introVideoThumbnail: '',
        introVideoThumbnailKey: '',
        introVideoUrl: '',
        rating: 0,
        totalLectures: 1,
        totalStudents: 0,
        totalRatingCount: 0,
        category: '',
        features: [],
        courseEnabled: false,
        courseStatus: 'off',
        Days: 30,
        Months: 0,
        expiresIn: 'not working for now'
    }).then(() => {
        res.redirect('/screen/GetCourses');
    });
    }else{
        res.redirect('/screen/signin')
    }
    

});

// DeleteCourse
router.get('/DeleteCourse/:id',auth, async (req, res) => {
    if(firebase.auth().currentUser){
let id = req.params.id;
    await dbs.collection('courses').doc(id).delete().then(() => {
        res.redirect('/screen/GetCourses');
    });
    }else{
        res.redirect('/screen/signin')
    }
    

});

// /EditCourse
router.get('/Edit_Course/:id',auth, async (req, res) => {
    if(firebase.auth().currentUser){
    let id = req.params.id;
    // either use dbs.collection('courses').doc(id) to get data of this and send to its edit menu.

    // gets categories name
    let categories;
    // gets the course name and its existing contents
    let data;

    await dbs.collection('categories').get().then((s) => {
        categories = s;
    })
    // categories.docs.forEach((s)=>{
    //     console.log(s.data().title);
    // })

    const catRef = await dbs.collection('courses').doc(id);
    const doc = await catRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        //   console.log('Document data:', doc.data());
        data = doc.data();
        let status = doc.data().courseStatus;
        //   console.log(data.category);
        res.render('screen/Edit_Course', { id: id, data: data, categories: categories, status: status });

    }

    }else{
        res.redirect('/screen/signin')
    }

});
// async   function f(){
//     let refer = dbs.collection('courses').doc('LYR0lmjTeX1e1gJxJZTo');
// let toDelete = await refer.get();
// if(!toDelete){console.log('no doc');}
// else{
//     console.log('got this data from delete===<><><>');
//     console.log(toDelete.data())
// }

//  }
//  f();


router.post('/Edit_Course',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 // let body= req.body;
    // console.log('sent data!:'+req.body.id);
    // console.log('whole received body: '+req.body);
    // console.log(body);


    let id = req.body.id;
    let title = req.body.title;
    let category = req.body.course_name;
    let description = req.body.description;
    let pprice = req.body.price;
    let oldPPrice = req.body.oldPrice;
    let tag = req.body.tag;
    let courseEnabled;
    let courseStatus = req.body.courseStatus;
    let price = pprice.toString();
    let oldPrice = oldPPrice.toString();
    var days = req.body.Days;
    var months = req.body.Months;
    var te = 'not working for now';
    console.log(te)
    var expiresIn = te;
    // console.log(id+' :: '+title+' :: '+category+' :: '+price+' :: '+rating+' :: '+description+' :: '+tag);
    // let bannerUrl=req.body.bannerUrl;
    let boi = req.body.bannerImage;
    let boib;
    let boic;
    console.log(req.body);

    // test zone(*)
    let refer = dbs.collection('courses').doc(id);
    let toDelete = await refer.get();
    if (!toDelete) { console.log('no doc'); }
    else {

        // console.log('got this data from delete===<><><>');
        // console.log(toDelete.data());
        //     const deleteStatus = await deleteImages({ downloadUrl:req.body.url });
        // console.log(deleteStatus)  //=> "success"
    }
    // 

    if (req.files) {
        if (req.files.bannerImage !== undefined) {
             // checker
 let str2= req.files.option4.mimetype;
 let ready2=str2.split("/",1);
     // ready2=JSON.stringify(ready2)
     console.log(ready2);
            if (ready2 == 'image') {

                var file = req.files.bannerImage;
                var filename = file.name;
                console.log(file)
                let loc = UUID();
                console.log(loc);
                file.mv('tmp/' + filename, async (err) => {
                    let a = upload('tmp/' + filename, loc);
                    boi = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(loc) + "?alt=media&token=" + loc;
                    console.log(boi);

                    //Delete old url
                    console.log('[+]To Delete banner url');
                    console.log(toDelete.data().bannerUrl.length);
                    if (toDelete.data().bannerUrl.length >= 10) {
                        console.log('[in delete]');
                        const deleteStatus = await deleteImages({ downloadUrl: toDelete.data().bannerUrl });
                        console.log(deleteStatus)  //=> "success"
                    }



                    //update banner url  
                    setTimeout(function () {
                        dbs.collection('courses').doc(id).update({

                            bannerUrl: boi
                        })
                    }, 1000)
                    return;
                })


            }

        }

    }

    if (req.files) {
        if (req.files.videoThumbnail !== undefined) {
             // checker
 let str2= req.files.option4.mimetype;
 let ready2=str2.split("/",1);
     // ready2=JSON.stringify(ready2)
     console.log(ready2);
            if (ready2 == 'image') {

                setTimeout(function b() {
                    var fileb = req.files.videoThumbnail;
                    var filenameb = req.files.videoThumbnail.name;
                    console.log(fileb)
                    let loc = UUID();
                    console.log(loc);
                    fileb.mv('tmp/' + filenameb, async (err) => {
                        let getter = await upload('tmp/' + filenameb, loc);
                        boib = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(loc) + "?alt=media&token=" + loc;
                        console.log(boib);

                        if (toDelete.data().videoThumbnail >= 10) {
                            //Delete introVideoThumbnail
                            const deleteStatus = await deleteImages({ downloadUrl: toDelete.data().introVideoThumbnail });
                            console.log(deleteStatus)  //=> "success"
                        }

                        // update introVideoThumbnail
                        setTimeout(function () {
                            dbs.collection('courses').doc(id).update({

                                introVideoThumbnail: boib
                            })
                        }, 1000)

                        return;
                    })
                }, 10)
            }

        }


    }

    //   if(req.files.video !== 'null' && req.files.video !== 'undefined'){
    if (req.files) {
        if (req.files.video !== undefined) {
             // checker
 let str2= req.files.option4.mimetype;
 let ready2=str2.split("/",1);
     // ready2=JSON.stringify(ready2)
     console.log(ready2);
            if (ready2 == 'video') {


                let ftype = req.files.video.mimetype;
                console.log('video type is: ' + ftype);
                setTimeout(function c() {

                    var filec = req.files.video;
                    var filenamec = req.files.video.name;
                    console.log(filec)
                    let loc = UUID();
                    console.log(loc);
                    filec.mv('tmp/' + filenamec, async (err) => {
                        // start from here man!
                        let life = uploadf('tmp/' + filenamec, loc);
                        boic = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(loc) + "?alt=media&token=" + loc;
                        console.log(boic);

                        //Delete introVideoThumbnail
                        if (toDelete.data().introVideoUrl >= 10) {
                            const deleteStatus = await deleteImages({ downloadUrl: toDelete.data().introVideoUrl });
                            console.log(deleteStatus)  //=> "success"
                        }



                        // update videoVideoUrl and videothumbnailKey
                        setTimeout(() => {
                            dbs.collection('courses').doc(id).update({

                                introVideoUrl: boic,
                                introVideoThumbnailKey: loc
                            })
                        }, 1000);
                        return;
                    })
                }, 10)
            }

        }

    }
    if (courseStatus === 'off') {
        courseEnabled = false;
    } else {
        courseEnabled = true;
    }

    setTimeout(function u() {

        dbs.collection('courses').doc(id).update({
            title: title,
            category: category,
            description: description,
            price: price,
            oldPrice: oldPrice,
            tag: tag,
            courseEnabled: courseEnabled,
            courseStatus: courseStatus,
            Days: days,
            Months: months,
            expiresIn: expiresIn
        }).then(() => {
            res.redirect('/screen/GetCourses');
        })

    }, 1000);


    // res.redirect('/screen/GetCourses');

    }else{
        res.redirect('/screen/signin')
    }
   

})
// manageFeatures
router.get('/manageFeatures/:id',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 let id = req.params.id;


    // 

    const Ref = dbs.collection('courses').doc(id);
    const doc = await Ref.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        let features = doc.data().features;
        console.log(features);
        res.render('screen/manageFeatures', { id: id, features: features });
    }
    // 



    }else{
        res.redirect('/screen/signin')
    }
   
})


router.post('/manageFeatures',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    let title = req.body.title;
    let id = req.body.id;
    var ty = req.files.iconImage.mimetype;
    console.log(ty);

     // checker
 let str2= req.files.iconImage.mimetype;
 let ready2=str2.split("/",1);
     // ready2=JSON.stringify(ready2)
     console.log(ready2);

    if (req.files && req.files !== undefined && ready2 == 'image') {
        // req.filesiconImage.mimetype == 'jpg' &&

        var file = req.files.iconImage;
        var filename = file.name;
        console.log(file)
        let loc = UUID();
        console.log(loc);

        file.mv('tmp/' + filename, async (err) => {
            boi = await upload('tmp/' + filename, loc);
            console.log(boi);
            const Ref = dbs.collection('courses').doc(id);
            // Ref.update({
            //     features: []
            // });
            setTimeout(function aka() {
                Ref.update({
                    features: firebase.firestore.FieldValue.arrayUnion(...[{
                        Key: loc,
                        iconUrl: boi,
                        title: title
                    }])
                });
            }, 5000)
            res.redirect('/screen/GetCourses');
            // come here!

        })

    }
    else {
        res.redirect('/screen/GetCourses');
        console.log('didnt work');
    }

    }else{
        res.redirect('/screen/signin')
    }

})

setTimeout(function sayHi() {
    console.log('Hello, Mr. Universe!');
}, 2000)

// deleteFeature

router.post('/DeleteFeature',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    let id = req.body.id;
    console.log(req.body)

    let Ref = dbs.collection('courses').doc(id);


    //call the deleteImages inside async function
    const deleteStatus = await deleteImages({ downloadUrl: req.body.url });
    console.log(deleteStatus)  //=> "success"

    // 

    Ref.update({
        features: firebase.firestore.FieldValue.arrayRemove(...[{
            Key: req.body.key,

            iconUrl: req.body.url,
            title: req.body.title
        }])
    });



    res.redirect('/screen/GetCourses');

    }else{
        res.redirect('/screen/signin')
    }

})


// manageSections
router.get('/manageSections/:id',auth, async (req, res) => {
    if(firebase.auth().currentUser){
let id = req.params.id;

    dbs.collection('courses').doc(id).collection('sections').orderBy('order', 'asc').get().then((snapshot) => {
        let sections = snapshot;

        sections.forEach((section) => {
            console.log(section.data());
        })
        res.render('screen/manageSections', { id: id, sections: sections, })
    })


    }else{
        res.redirect('/screen/signin')
    }

    
});
router.post('/manageSections',auth, async (req, res) => {
    if(firebase.auth().currentUser){
 let sections = req.body.sections;
    let id = req.body.id;
    //   
    console.log(req.body);
    await dbs.collection('courses').doc(id).collection('sections').add({
        timestamp: new Date(),
        title: sections,
        lectures: [],
        order: 1,
        QuizProgress: {
            score: 0,
            isPlayed: false
        },
        quiz: [],
        quizDesc: 'Add Description',
        quizThumbnail: 'https://i.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA',

    }).then(() => {
        res.redirect(`/screen/manageSections/${id}`);
    }).catch((err) => {
        console.log('error at / : ' + err);
    })
    // 
    //   res.render('screen/manageSections', {id:id})
    }else{
        res.redirect('/screen/signin')
    }

   
});

// increment or decrement 1

// upate sectionNo
router.post('/updateSectionNo',auth, async (req, res) => {

    if(firebase.auth().currentUser){
let id = req.body.id;
    let sectionId = req.body.sectionId;
    let order = req.body.order;
    let uid = req.body.title;
    let ref = dbs.collection('courses/' + id + '/sections/').doc(sectionId);
    ref.update({
        order: parseInt(order)
    })
    res.redirect(`/screen/GetSection/${id}/${sectionId
        }/${uid}`)
    }else{
        res.redirect('/screen/signin')
    }


    
})

// GetSection

router.get('/GetSection/:id/:sectionId/:title',auth, async (req, res) => {

    if(firebase.auth().currentUser){

    console.log(req.params);
    let id = req.params.id;
    let sectionId = req.params.sectionId;
    let title = req.params.title;
    let te;
    let quiz_desc;
    await dbs.collection('courses/' + id + '/sections/').where('title', '==', title).get().then((snapshot) => {
        let section = snapshot;

        section.docs.forEach(doc => {
            console.log(doc.data().lectures);
            // lectures
            te = doc.data().lectures
            quiz_desc = doc.data().quizDesc;
        })

        res.render('screen/GetSection', { sectionId: sectionId, id: id, sections: section, te: te, title: title, quiz_desc: quiz_desc });
    }).catch((err) => {
        console.log('error at / : ' + err);
    })
    }else{
        res.redirect('/screen/signin')
    }


});

// AddLec 
//         router.post('/AddLec', async(req,res)=>{
//             let title= req.body.title;
//             let id = req.body.id;
//             let leacture = req.body.leacture;
//             let sec_id = req.body.sectionId;
//             let Demo =req.body.Demo?true:false;


//             let u= UUID();
//             // if demo is false then put in lecs else

//             // test zone()

//             var fileb;
//             var filenameb;
//             let loac;
//             let boib;

//             // 2nd
//             let boic;
//             var filec ;
//             var filenamec;
//             let location;
//             let the_data;


//          // picture
//          if(req.files){
//             if(req.files.lectureThumbnail !== undefined && req.files.lectureThumbnail.mimetype === 'image/png' || req.files.lectureThumbnail.mimetype === 'image/jpeg'){

//                 setTimeout(function pic(){
//                     fileb = req.files.lectureThumbnail;
//                     filenameb=  req.files.lectureThumbnail.name;
//                 console.log(fileb)
//                    loac= UUID();
//                 console.log(loac);
//                 fileb.mv('tmp/'+filenameb,async (err)=>{
//                     boib = await upload('tmp/'+filenameb,loac);
//                     console.log('lecture Thumbnail updated here is the new value: ===>');
//                     console.log(boib);

//                 }) 
//                 }, 0)
//                 }

//          }

//          // video 
//          if(req.files.lectureVideoUrl !== undefined && !req.body.url){
//             if(req.files.lectureVideoUrl !== undefined && 'application/octet-stream'){

//                     setTimeout(function b(){

//                         filec = req.files.lectureVideoUrl;
//                         filenamec=  req.files.lectureVideoUrl.name;
//                     console.log(filec)
//                     location= UUID();
//                     console.log(location);
//                     filec.mv('tmp/'+filenamec,async (err)=>{
//                         boic = await uploadf('tmp/'+filenamec,location);
//                         console.log('video thumbnail is updated here is the link:================>');
//                         console.log(boic);


//                         // })

//                     }) 
//                     },0)
//                     }
//          }


// let fun = dbs.collection('courses').doc(id);
// let addition;
// let received= await fun.get();
// if(received){
//     console.log(received.data().totalLectures);
//     let temp = received.data().totalLectures;
//     addition= temp+1;
//     console.log(addition);
// }
//             // 
// console.log(Demo);
//             setTimeout(function f(){
//            if(Demo===false){
// console.log('[+] In Demo False =>');
//             const Ref = dbs.collection('courses/'+id+'/sections/').doc(sec_id);
//             Ref.update({

//                     lectures: firebase.firestore.FieldValue.arrayUnion(...[{id:u,
//                         lectureThumbnail:boib,picKey:loac,
//                          vidKey:location,lectureVideoUrl:boic,
//                         title:leacture}])
//             });
//             // addition of count
//             dbs.collection('courses').doc(id).update({ totalLectures:addition });
//             res.redirect(`/screen/GetSection/${id}/${sec_id}/${title}`);
//            }else{
//             let a = dbs.collection('courses').doc(id);
//             a.update({
//                     demoVideos: firebase.firestore.FieldValue.arrayUnion(...[{id:u,thumbnailUrl:boib,
//                          videoUrl:boic,
//                         title:leacture}])
//             });
//             console.log(req.body);

//             res.redirect(`/screen/GetSection/${id}/${sec_id}/${title}`);
//            }

//         },50000)
//             //  
//         })





// deleteSection
router.get('/deleteSection/:id/:sec_id',auth, (req, res) => {
    if(firebase.auth().currentUser){

    let sec_id = req.params.sec_id
    let id = req.params.id
    const Ref = dbs.collection('courses/' + id + '/sections/').doc(sec_id);
    Ref.delete();
    setTimeout(() => {
        res.redirect(`/screen/manageSections/${id}`);
    }, 500);

    }else{
        res.redirect('/screen/signin')
    }



})
// the editing of lecture
router.get('/Edit_Lecture/:id/:sec_id/:lec_id/:lec_title/:uid',auth, async (req, res) => {
    if(firebase.auth().currentUser){
let uid = req.params.uid;
    // console.log(req.params);
    let id = req.params.id;
    let sec_id = req.params.sec_id;
    let lec_id = req.params.lec_id;
    let lec_title = req.params.lec_title;


    res.render('screen/Edit_Lecture', { id: id, title: lec_title, sec_id: sec_id, lec_id: lec_id, uid: uid })
    }else{
        res.redirect('/screen/signin')
    }
    
    
    
})



router.post('/Edit_Lecture',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    // console.log(req.body);
    let uid = req.body.uid;
    let id = req.body.id;
    let sec_id = req.body.sec_id;
    let url;
    let lec_id = req.body.lec_id;
    // let old_thumbnailUrl = req.body.old_thumbnailUrl;
    // let old_lectureVideoUrl = req.body.old_lectureVideoUrl;



    // res.send('working')

    var fileb;
    var filenameb;
    let loac;
    let boib;

    // 2nd
    let boic;
    var filec;
    var filenamec;
    let location;
    let the_data;

    // TESTZONE(+)
    // this gets data about edit lecture and delete its old content to replace with new
    let finder = dbs.collection('courses/' + id + '/sections').doc(sec_id);
    let all2 = await finder.get();
    let save2;
    let the_data2;

    if (!all2) { console.log('no doc found'); }
    else {

        console.log('All 2 has got this data ################################################################');
        console.log(all2.data());

        save2 = all2.data().lectures;
        // console.log(save);

        the_data2 = save2.filter(item => item.id == lec_id)

        console.log('This is filtered data **************************************************************');
        console.log(the_data2);


        // console.log();
        //   console.log(url + ' ///////// ' + vidurl);

    }


    // end test zone


    // picture
    if (req.files) {
        if (req.files.lectureThumbnail !== undefined) if (req.files.lectureThumbnail.mimetype === 'image/png' || req.files.lectureThumbnail.mimetype === 'image/jpeg' || req.files.lectureThumbnail.mimetype === 'image/jpg') {

            setTimeout(function pic() {
                fileb = req.files.lectureThumbnail;
                filenameb = req.files.lectureThumbnail.name;
                console.log(fileb)
                loac = UUID();
                console.log(loac);
                fileb.mv('tmp/' + filenameb, async (err) => {
                    let oc = upload('tmp/' + filenameb, loac);
                    console.log('lecture Thumbnail updated here is the new value: ===>');
                    boib = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(loac) + "?alt=media&token=" + loac;
                    console.log(boib);

                    // deleting old thumbnail
                    let deleteStatus;
                    let url = the_data2.map((item) => {
                        return item.lectureThumbnail;
                    })
                    if (url !== undefined || url !== null) {
                        deleteStatus = await deleteImages({ downloadUrl: url });
                        console.log(deleteStatus)  //=> "success"
                    }

                    // dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({

                    //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
                    //         id:lec_id,
                    //         lectureThumbnail:boib,
                    //         id:id,
                    //         title:title,
                    //       //   lectureThumbnail:lectureThumbnail,

                    //       }])
                    // })
                    return;
                })
            }, 1)
        }

    }

    // video 
    if (req.files) {
        // if (req.files.lectureVideoUrl !== undefined && !req.body.url) {
        if (req.files.lectureVideoUrl !== undefined) {
            if (req.files.lectureVideoUrl !== undefined) {
                if (req.files.lectureVideoUrl.mimetype == 'video/webm' || req.files.lectureVideoUrl.mimetype == 'video/webm' || req.files.lectureVideoUrl.mimetype == 'video/x-matroska') {

                    setTimeout(function b() {

                        filec = req.files.lectureVideoUrl;
                        filenamec = req.files.lectureVideoUrl.name;
                        console.log(filec)
                        location = UUID();
                        url = '../'
                        console.log(location);
                        filec.mv('tmp/' + filenamec, async (err) => {
                            let ocd = uploadf('tmp/' + filenamec, location);
                            console.log('video thumbnail is updated here is the link:================>');
                            boic = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(location) + "?alt=media&token=" + location;
                            console.log(boic);

                            // delete videourl
                            let vidurl = the_data2.map((item) => {
                                return item.lectureVideoUrl;
                            })


                            let deletevid;

                            if (vidurl != '...') {
                                deletevid = await deleteImages({ downloadUrl: vidurl });
                                console.log(deletevid)  //=> "success"
                            }


                            // dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({
                            //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
                            //         id:id,
                            //         title:title,
                            //         lectureVideoKey:location,
                            //         lectureVideoUrl:boic            

                            //       }]) 

                            // })
                            return;
                        })
                    }, 10)
                }
            }
        }
    }
    // update feature
    // if (!req.files) {
    //     if (req.body.url) {
    //         url = req.body.url;
    //         location = '...';
    //         boic = '...';


    //          // delete videourl
    //          let vidurl = the_data2.map((item) => {
    //             return item.lectureVideoUrl;
    //         })

    //         let deletevid;

    //         if (vidurl != '...') {
    //             deletevid = await deleteImages({ downloadUrl: vidurl });
    //             console.log(deletevid)  //=> "success"
    //         }


    //     }
    // }
    // if(!req.files && !req.body.url){
    //     res.redirect(`/screen/GetSection/${id}/${sec_id
    //     }/${uid}`)
    // }


    //  dbs.collection('courses/'+id+'/sections').get(sec_id).then((snap)=>{
    //    let ok = snap
    //     ok.docs.forEach((item)=>{
    //         console.log(item.data().lectures);
    //         ok = item.data().lectures;
    //     })
    // })

    // test zone(*)
    let save = [];
    let Ref = await dbs.collection('courses/' + id + '/sections').doc(sec_id);
    let got = Ref.get();
    got.then((snap) => {
        let fun = snap
        if (!fun) {
            console.log('no doc');
        } else {

            console.log(fun.data().title);
            save = fun.data().lectures;
            console.log('results : ===>');


            setTimeout(function h() {
                the_data = save.map(item => {
                    if (item.id == lec_id) {
                        return {
                            id: lec_id,
                            title: req.body.title || item.title,
                            picKey: loac || item.picKey,
                            vidKey: location || item.vidKey,
                            lectureThumbnail: boib || item.lectureThumbnail,
                            lectureVideoUrl: boic || item.lectureVideoUrl,
                            url: '...' || item.url
                            // url: req.body.url || item.url
                        }
                    } else {
                        return item
                    }
                })
            }, 3000)

            // update image video and text: ps both keys

            // let obj = JSON.stringify(the_data); 
            // res.send(obj.getString('title'));

        }
        setTimeout(function live() {
            let ref = dbs.collection('courses/' + id + '/sections/').doc(sec_id);
            ref.update({
                lectures: the_data
            });

        }, 4000)
    })

    let ok;
    dbs.collection('courses/' + id + '/sections').get(sec_id).then((snap) => {
        ok = snap
        ok.docs.forEach((item) => {
            console.log();
            ok = item.data().title;
        })
    })

    //  res.redirect(`/screen/GetSection/${id}/${sec_id}/${ok}`);
    setTimeout(() => {
        res.redirect(`/screen/GetSection/${id}/${sec_id
            }/${uid}`)
    }, 5000)

    }else{
        res.redirect('/screen/signin')
    }



})










// Delete_Lecture/
router.get('/Delete_Lecture/:id/:sec_id/:title/:uid',auth, async (req, res) => {
    if(firebase.auth().currentUser){
console.log(req.params);
    let id = req.params.id;
    let sec_id = req.params.sec_id;
    let title = req.params.title;
    let uid = req.params.uid;
    // let old_title = req.params.old_title;

    console.log('ok in delete_lecture');


    // let ref = dbs.collection('courses/'+id+'/sections/');
    // ref.get(sec_id).then((sn)=>{
    //     let data= sn;
    //     data.docs.forEach((a)=>{
    //         // console.log(a.data().title);

    //     })
    // })

    // test for deleteing code
    let save = [];

    let Ref = await dbs.collection('courses/' + id + '/sections').doc(sec_id);
    let got = Ref.get();
    got.then(async (snap) => {
        let all = snap;
        if (!all) {
            console.log('no doc');
        } else {

            console.log('we got this data [~]')
            console.log(all.data());

            save = all.data().lectures;
            // console.log(save);

            let the_data = save.filter(item => item.id == title)
            console.log(the_data);

            let url = the_data.map((item) => {
                return item.lectureThumbnail;
            })
            let vidurl = the_data.map((item) => {
                return item.lectureVideoUrl;
            })
            let demo = the_data.map((item) => {
                return item.demo;
            })
            // // demo video
            // if(demo === true){

            // }
            let deleteStatus;
            let deletevid;
            if (url != undefined || url != null) {
                deleteStatus = await deleteImages({ downloadUrl: url });
                console.log(deleteStatus)  //=> "success"
            }
            if (vidurl != '...') {
                deletevid = await deleteImages({ downloadUrl: vidurl });
                console.log(deletevid)  //=> "success"
            }

            // console.log();
            console.log(url + ' ///////// ' + vidurl);




            //   

            //  count set for lectures decrement (*)
            let fun = dbs.collection('courses').doc(id);
            let subtraction;
            let received = await fun.get();
            if (received) {
                console.log(received.data().totalLectures);
                let temp = received.data().totalLectures;
                subtraction = temp - 1;
                console.log(subtraction);
            }
            dbs.collection('courses').doc(id).update({
                totalLectures: subtraction
            });
            // 



            //  DELETE FUNCTIONS
            setTimeout(function t() {
                dbs.collection('courses/' + id + '/sections').doc(sec_id).update({
                    lectures: firebase.firestore.FieldValue.arrayRemove(...the_data)
                });
                setTimeout(() => {
                    console.log('deleted!');
                    res.redirect(`/screen/GetSection/${id}/${sec_id}/${uid}`);
                }, 1000)
            }, 1000);







        }




    })

    // 



    //   /GetSection/:id/:sectionId/:title

    }else{
        res.redirect('/screen/signin')
    }
    
})

// Get Demo Videos 
router.get('/DemoVideos/:id',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    let id = req.params.id;
    // console.log(id);

    let Demo;
    // await dbs.collection('courses').get(id).then((snap) => {
    //     Demo = snap;
    //     Demo.docs.forEach((d) => {
    //         // console.log(d.data().demoVideos);

    //         te = d.data().demoVideos;


    //     })
    //     res.render('screen/DemoVideos', { te: Demo, id: id });

    // });
    let myref = dbs.collection('courses').doc(id);
    let data = await myref.get();
    console.log(data.data().demoVideos);
    Demo = data.data().demoVideos;
    res.render('screen/DemoVideos', { te: Demo, id: id });

    }else{
        res.redirect('/screen/signin')
    }


})
// Delete DemoVideos
router.get('/Delete_DemoVideos/:id/:lec_id',auth, async (req, res) => {

    if(firebase.auth().currentUser){

    let id = req.params.id;
    let lec_id = req.params.lec_id;

    console.log(req.params);

    // test zone(*)
    let save;
    let Ref = dbs.collection('courses').get(id);
    Ref.then((snap) => {

        if (!snap) {
            console.log('no doc');
        } else {
            snap.docs.forEach(async (doc) => {
                console.log('we got this data [~]')
                //  console.log(doc.data());

                save = doc.data().demoVideos;
                // console.log(save);

                let the_data = save.filter(item => item.id == lec_id)
                console.log('the data has this for you ===>');
                console.log(the_data);

                let url = the_data.map((item) => {
                    return item.thumbnailUrl;
                })
                let vidurl = the_data.map((item) => {
                    return item.videoUrl;
                })
                console.log(url + ' ///////// ' + vidurl);
                //delete  IMAGE
                //call the deleteImages inside async function
                if (url !== undefined) {
                    const deleteStatus = await deleteImages({ downloadUrl: url });
                    console.log(deleteStatus)  //=> "success"
                }
                if (vidurl !== undefined) {
                    const deletevid = await deleteImages({ downloadUrl: vidurl });
                    console.log(deletevid)  //=> "success"
                }

                //   
                //  test zone(*)-not meant for demo
                //   let fun = dbs.collection('courses').doc(id);
                //   let addition;
                //   let received= await fun.get();
                //   if(received){
                //       console.log(received.data().totalLectures);
                //       let temp = received.data().totalLectures;
                //       addition= temp-1;
                //       console.log(addition);
                //   }
                //   dbs.collection('courses').doc(id).update({
                //       totalLectures:addition
                //   });
                // 

                //  DELETE FUNCTIONS
                setTimeout(function t() {
                    dbs.collection('courses').doc(id).update({
                        demoVideos: firebase.firestore.FieldValue.arrayRemove(...the_data)
                    });
                }, 2000);

            })





        }


        setTimeout(() => {
            res.redirect(`/screen/DemoVideos/${id}`)
        }, 2000)

    })



    // 


    }else{
        res.redirect('/screen/signin')
    }





})
let hello
// uploadQuiz
router.post('/uploadQuiz',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    console.log(req.body);
    let id = req.body.id;
    let sectionId = req.body.sectionId;
    let title = req.body.title;
    let question = req.body.question;
    let options = req.body.options;
    let answer = req.body.answer;

    // quiz images (will be used in /tmp+ quiz_image)







    // quiz images url
    let qThumbnail;
    let o1;
    let o2;
    let o3;
    let o4;

    let t;
    // four image ids
    let qid;
    let o1id;
    let o2id;
    let o3id;
    let o4id;

    console.log('the data$$$$');
    console.log(req.files)

    //upload images 
    if (req.files) {
        console.log('[+] in if conditional');
        if (req.files.questionThumbnail !== undefined) {
            // checker
            let str2= req.files.questionThumbnail.mimetype;
            let ready2=str2.split("/",1);
                // ready2=JSON.stringify(ready2)
                console.log(ready2);
            if (ready2 == 'image') {
                console.log('[+0~] in if question');
                let Tq = req.files.questionThumbnail;
                Tq.mv('tmp/' + req.files.questionThumbnail.name, (err) => {
                    qid = UUID();
                    t = upload('tmp/' + req.files.questionThumbnail.name, qid);
                    console.log('question updated here is the new value: ===>');
                    qThumbnail = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(qid) + "?alt=media&token=" + qid;
                    console.log(qThumbnail);
                    return;
                });
            } else {
                qThumbnail = '...';
                console.log('qThunmbnail else man  inside.......>');
               
            }
            console.log('up');
            
           
        }
        else {
            qThumbnail = '...';
            console.log('qThumbnail else man .......>');
         
        }

        console.log('down2 two');
        if (req.files.option1 !== undefined) {
            // checker
            let str2= req.files.option1.mimetype;
            let ready2=str2.split("/",1);
                // ready2=JSON.stringify(ready2)
                console.log(ready2);
            if (ready2 == 'image') {
                console.log('[+1~] in if option1');
                let To1 = req.files.option1;
                To1.mv('tmp/' + req.files.option1.name, (err) => {
                    o1id = UUID();
                    t = upload('tmp/' + req.files.option1.name, o1id);
                    console.log('option1 updated here is the new value: ===>');
                    o1 = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(o1id) + "?alt=media&token=" + o1id;
                    console.log(o1);
                    return;
                });
            } else {
                o1 = '...';
                console.log('o1 else man  inside.......>');
                
            }
        } else {
            o1 = '...';
            console.log('o1 else man .......>');

        }

        console.log('*************************coming here##########');

        if (req.files.option2 !== undefined) {
            // checker
            let str2= req.files.option2.mimetype;
            let ready2=str2.split("/",1);
                // ready2=JSON.stringify(ready2)
                console.log(ready2);
            if (ready2 == 'image') {
                console.log('[+2~] in if option2');
                let To2 = req.files.option2;
                To2.mv('tmp/' + req.files.option2.name, (err) => {
                    o2id = UUID();
                    t = upload('tmp/' + req.files.option2.name, o2id);
                    console.log('option2 updated here is the new value: ===>');
                    o2 = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(o2id) + "?alt=media&token=" + o2id;
                    console.log(o2);
                    return;
                });
            } else {
                o2 = '...';
                console.log('o2 else man  inside.......>');
                
            }
        } else {
            o2 = '...';
            console.log('o2 else man .......>');

        }
        if (req.files.option3 !== undefined) {
            // checker
            let str2= req.files.option3.mimetype;
            let ready2=str2.split("/",1);
                // ready2=JSON.stringify(ready2)
                console.log(ready2);
            if (ready2 == 'image') {
                console.log('[+3~] in if option3');
                let To3 = req.files.option3;
                To3.mv('tmp/' + req.files.option3.name, (err) => {
                    o3id = UUID();
                    t = upload('tmp/' + req.files.option3.name, o3id);
                    console.log('option3 updated here is the new value: ===>');
                    o3 = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(o3id) + "?alt=media&token=" + o3id;
                    console.log(o3);
                    return;
                });
            } else {
                o3 = '...';
                console.log('o3 else man  inside.......>');
                
            }
        } else {
            o3 = '...';
            console.log('o3 else man .......>');

        }
        if (req.files.option4 !== undefined) {
            // checker
            let str2= req.files.option4.mimetype;
            let ready2=str2.split("/",1);
                // ready2=JSON.stringify(ready2)
                console.log(ready2);
            if (ready2 == 'image') {
                console.log('[+4~] in if option4');
                let To4 = req.files.option4;
                To4.mv('tmp/' + req.files.option4.name, (err) => {
                    o4id = UUID();
                    t = upload('tmp/' + req.files.option4.name, o4id);
                    console.log('option4 updated here is the new value: ===>');
                    o4 = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(o4id) + "?alt=media&token=" + o4id;
                    console.log(o4);
                    return;
                });
            } else {
                o4 = '...';
                console.log('o4 else man  inside.......>');
                
            }
        } else {
            o4 = '...';
            console.log('o4 else man .......>');

        }
    }
    else {
        qThumbnail = '...';
        o1 = '...';
        o2 = '...';
        o3 = '...';
        o4 = '...';
    }
    // qThumbnail='...';
    // o1='...';
    // o2='...';
    // o3='...';
    // o4='...';

    let uuid = UUID();
    let n = dbs.collection('courses/' + id + '/sections').get(sectionId);
    let ref = dbs.collection('courses/' + id + '/sections/').doc(sectionId);

    // update content
    setTimeout(() => {
        ref.update({
            quiz: firebase.firestore.FieldValue.arrayUnion(...[{
                id: uuid,
                question: question,
                options: options,
                answer: answer,
                qThumbnail: qThumbnail,
                o1: o1,
                o2: o2,
                o3: o3,
                o4: o4,
            }])
        })
    }, 1000);

    n.then((snap) => {
        if (!snap) {
            console.log('no doc');
        } else {
            let data = snap;
            data.docs.forEach((s) => {

            })
        }
    })
    // res.redirect('/screen/GetCourses');
    //  test zone(*)
    setTimeout(() => {
        res.redirect(`/screen/GetSection/${id}/${sectionId}/${title}`);
    }, 1000)

    }else{
        res.redirect('/screen/signin')
    }

    // 
})

// display quiz
router.get('/uploadQuiz/:id/:sectionId/:title',auth, async (req, res) => {

    if(firebase.auth().currentUser){

    let title = req.params.title;
    let id = req.params.id;
    let sectionId = req.params.sectionId;
    console.log(req.params);
    let data;
    //    dbs.collection('courses/'+id+'/sections').doc(sectionId).then((snap)=>{
    //        if(!snap){
    //            console.log('no docs or error maybe:');
    //        }
    //        else{
    //            snap.docs.forEach((doc)=>{
    //                data= doc.data().quiz;
    //            console.log('in uplaod quiz and these are quizes==>');
    //            console.log(doc.data().quiz);
    //            })
    //        }

    //          res.render('screen/uploadQuiz', {data:data,id:id,sectionId:sectionId,title:title});


    //     });
    let d = dbs.collection('courses/' + id + '/sections').doc(sectionId);
    let doc = await d.get();
    if (!doc.exists) {
        console.log('no doc!');
    } else {
        console.log('tite i received');
        console.log(doc.data().quiz);
        data = doc.data().quiz;
        res.render('screen/uploadQuiz', { data: data, id: id, sectionId: sectionId, title: title });
    }


    }else{
        res.redirect('/screen/signin')
    }


})


// deleteQuiz
router.get('/deleteQuiz/:id/:doc_id/:sectionId/:title',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    console.log('in delete quiz==>');
    console.log(req.params);
    let title = req.body.title;
    let id = req.params.id;
    let doc_id = req.params.doc_id;
    let sectionId = req.params.sectionId;

    let save;

    let store;
    // test zone(*)
    let zone = dbs.collection('courses/' + id + '/sections').doc(sectionId);
    let doc = await zone.get();
    if (!doc.exists) {
        console.log('no doc in delete quiz');
    }
    else {
        store = doc.data().title;
        console.log('the title is=>');
        console.log(doc.data().title);
    }

    // 
    let Ref = dbs.collection('courses/' + id + '/sections').get(sectionId);
    Ref.then((snap) => {

        if (!snap) {
            console.log('no doc');
        } else {

            snap.docs.forEach(async (doc) => {
                console.log('this is the title:');
                let ok = doc.data().title;
                console.log(ok);
                save = doc.data().quiz;

                // filter getter
                let the_data = save.filter(item => item.id == doc_id);

                console.log('the data contains==>');
                console.log(the_data);



                // test zone(+)/////////////
                // delete images trap
                // qThumbnail
                let qThumbnail = the_data.map((item) => {
                    console.log('this is item thumbnail');
                    console.log(item.qThumbnail)
                    return item.qThumbnail;
                })
                if (qThumbnail.length >= 10) {
                    const deleteStatus = await deleteImages({ downloadUrl: qThumbnail });
                    console.log(deleteStatus)  //=> "success"

                }

                // o1
                let o1 = the_data.map((item) => {
                    return item.o1;
                })
                if (o1.length >= 10) {
                    const deleteStatus = await deleteImages({ downloadUrl: o1 });
                    console.log(deleteStatus)  //=> "success"

                }

                // o2
                let o2 = the_data.map((item) => {
                    return item.o2;
                })
                if (o2.length >= 10) {
                    const deleteStatus = await deleteImages({ downloadUrl: o2 });
                    console.log(deleteStatus)  //=> "success"

                }

                // o3
                let o3 = the_data.map((item) => {
                    return item.o3;
                })
                if (o3.length >= 10) {
                    const deleteStatus = await deleteImages({ downloadUrl: o3 });
                    console.log(deleteStatus)  //=> "success"

                }


                // o4
                let o4 = the_data.map((item) => {
                    return item.o4;
                })
                if (o4.length >= 10) {
                    const deleteStatus = await deleteImages({ downloadUrl: o4 });
                    console.log(deleteStatus)  //=> "success"

                }

                // test zone(end+)//////////


                // delete map
                dbs.collection('courses/' + id + '/sections').doc(sectionId).update({
                    quiz: firebase.firestore.FieldValue.arrayRemove(...the_data)
                });

            })

        }

    })
    setTimeout(() => {
        res.redirect(`/screen/uploadQuiz/${id}/${sectionId}/${store}`);
    }, 1500)
    }else{
        res.redirect('/screen/signin')
    }



})



// Edit_quiz
router.post('/Edit_quiz',auth, async (req, res) => {

    if(firebase.auth().currentUser){

    let id = req.body.id;
    let title = req.body.title;
    let sectionId = req.body.sectionId;
    let quizDesc = req.body.quizDesc;
    // test zone
    console.log(req.body);


    // 
    // test zone(*)
    if (req.files) {
        let str2= req.files.quizThumbnail.mimetype;
        let ready2=str2.split("/",1);
            // ready2=JSON.stringify(ready2)
        if (ready2 == 'image') {


            var file = req.files.quizThumbnail;
            var filename = file.name;
            console.log(file)
            let loc = UUID();
            console.log(loc);


            // check part
            let bro = dbs.collection('courses/' + id + '/sections').doc(sectionId);
            let o = await bro.get();
            let refer;
            if (!o) { console.log('no doc!'); }
            else {
                console.log('[++]quizThumbnail');
                console.log(o.data())
                refer = o.data().quizThumbnail;
            }
            console.log('The thumbnail url is: ');
            console.log(refer);
            // condition to check wether there is already any thumbnail or not
            if (refer.length <= 10 || !refer == 'https://i.picsum.photos/id/866/536/354.jpg?hmac=tGofDTV7tl2rprappPzKFiZ9vDh5MKj39oa2D--gqhA') {

                let i = refer;

                console.log('[+] Executing old quiz pic CUZ  quizThumbnail is  NOT EMPTY ');
                const deleteStatus = await deleteImages({ downloadUrl: i });
                console.log(deleteStatus)  //=> "success"
            }


            //    upload part
            setTimeout(() => {
                file.mv('tmp/' + filename, async (err) => {

                    boi = await upload('tmp/' + filename, loc);



                    // come here!
                    setTimeout(function aka() {
                        dbs.collection('courses/' + id + '/sections').doc(sectionId).update({
                            quizDesc: quizDesc,
                            quizThumbnail: boi
                        });
                    }, 2000)
                    res.redirect(`/screen/GetSection/${id}/${sectionId}/${title}`);

                })
            }, 100)

        }
    }
    // if empty
    if (!req.files) {

        // come here!
        dbs.collection('courses/' + id + '/sections').doc(sectionId).update({
            quizDesc: quizDesc,
        });
        res.redirect(`/screen/GetSection/${id}/${sectionId}/${title}`);

    }


    }else{
        res.redirect('/screen/signin')
    }


})

// showLec
router.get('/showLec/:id/:secId/:title',auth,async(req,res)=>{
    if(firebase.auth().currentUser){

    // id secid title
    let id =req.params.id
    let secid =req.params.secId
    let title =req.params.title
    let all;

    let ref = dbs.collection('courses/' + id + '/sections').doc(secid);
    let d_ref = dbs.collection('courses').doc(id);
    let demo_data= await d_ref.get();
    let demoVideos= demo_data.data().demoVideos;
    
    let data = await ref.get();
    all=data.data().lectures
    console.log('##################')
    console.log(demoVideos)
    console.log('##################')

    res.render('screen/showLec',{te:all,sectionId:secid,title:title,id: id,demo:demoVideos});
    }else{
        res.redirect('/screen/signin')
    }
    
    
});

// new module for create leactures
router.post('/AddLec',auth, async (req, res) => {
    if(firebase.auth().currentUser){

    let title = req.body.title;
    let id = req.body.id;
    let leacture = req.body.leacture;
    let sec_id = req.body.sectionId;
    let Demo = req.body.Demo ? true : false;

    // the url
    // let url = req.body.url;
    console.log(req.files)
    let u = UUID();
    // if demo is false then put in lecs else

    // test zone()

    var fileb;
    var filenameb;
    let loac;
    let boib;

    // 2nd
    let boic;
    var filec;
    var filenamec;
    let location;
    let the_data;
    // let glength = req.body.url;
    // let length = glength.length;
    
    // picture
    if (req.files) {
        let star= req.files.lectureThumbnail.mimetype;
    let ready=star.split("/",1);
    // ready= JSON.stringify(ready);
    console.log(ready);
    console.log(ready)
        if (req.files.lectureThumbnail !== undefined && ready == 'image') {

            setTimeout(function pic() {
                fileb = req.files.lectureThumbnail;
                filenameb = req.files.lectureThumbnail.name;
                // console.log(fileb)
                loac = UUID();
                console.log(loac);
                fileb.mv('tmp/' + filenameb, async (err) => {
                    let random = upload('tmp/' + filenameb, loac);
                    console.log('lecture Thumbnail updated here is the new value: ===>');
                    console.log(boib);

                })
                boib = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(loac) + "?alt=media&token=" + loac;
            }, 0)
        } else {
            boib = '...'
            loac = '...'
        }

    }

    //  url checker

    console.log(req.files);
    

    // video 
    // if (req.files.lectureVideoUrl !== undefined && length <= 12) {
    if (req.files.lectureVideoUrl !== undefined) {
        let str2= req.files.lectureVideoUrl.mimetype;
    let ready2=str2.split("/",1);
        // ready2=JSON.stringify(ready2);
        // console.log(ready);
        console.log('outside oct stream');
        if (ready2 == 'video') {
            console.log('[+] in octstream // lecture video url...');
            setTimeout(async function b() {

                filec = req.files.lectureVideoUrl;
                filenamec = req.files.lectureVideoUrl.name;
                // console.log(filec)
                location = UUID();
                url = '...';
                console.log(location);

                filec.mv('tmp/' + filenamec, async (err) => {
                    let random = uploadf('tmp/' + filenamec, location);
                    console.log('video thumbnail is updated here is the link:================>');
                    console.log(boic);


                    // })

                })
                boic = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(location) + "?alt=media&token=" + location;
                console.log(boic);



                // temp code
                // .then(()=>{
                //     console.log('ok bois this code can execute now....');
                // }) 

            }, 0)

        } else {
            boic = '...'
            location = '...'
            // console.log('all conditional s failed');
            // res.redirect(`/screen/GetSection/${id}/${sec_id}/${title}`);
        }

    }
    // if (req.files.lectureVideoUrl === undefined && length > 12) {
    // if (req.files.lectureVideoUrl === undefined ) {
    //     console.log('triggered  url inside!');
    //     location = '...';
    //     boic = '...';
    //     url = req.body.url;

    // }
    // else if (req.files.lectureVideoUrl !== undefined && length > 12) {
    //     console.log('triggered URL  with non undefind value of videourl!');
    //     location = '...';
    //     boic = '...';
    //     url = req.body.url;
    //     //    url.length >= 13 then accept this other wise not\
    //     // length not working ...
    // }

    // console.log('the length is .....................');
    // console.log(length);

    // count updator will only work when demo == false
    let fun = dbs.collection('courses').doc(id);
    let addition;
    let received = await fun.get();
    if (received) {
        console.log(received.data().totalLectures);
        let temp = received.data().totalLectures;
        addition = temp + 1;
        console.log(addition);
    }
    // 
    console.log(Demo);
    setTimeout(function f() {

        if (Demo === false) {
            console.log('[+] In Demo False =>');

            const Ref = dbs.collection('courses/' + id + '/sections/').doc(sec_id);
            Ref.update({

                lectures: firebase.firestore.FieldValue.arrayUnion(...[{
                    id: u,
                    lectureThumbnail: boib, 
                    // picKey: loac,
                    // vidKey: location, 
                    lectureVideoUrl: boic,
                    title: leacture, 
                    url: '...',
                    demo:Demo
                    // title: leacture, url: req.body.url
                }])
            });
            // addition of count
            dbs.collection('courses').doc(id).update({ totalLectures: addition });
            res.redirect(`/screen/GetSection/${id}/${sec_id}/${title}`);
        } else {
            console.log('[~] In Demo True .....');
            // add lecture link in demo
            let a = dbs.collection('courses').doc(id);
            // a.update({
            //     demoVideos: firebase.firestore.FieldValue.arrayUnion(...[{
            //         id: u,
            //         thumbnailUrl: boib,
            //         videoUrl: boic,
            //         title: leacture,
            //         url: '...',
            //         demo:Demo
            //         // url: req.body.url
            //     }])
            // });
            a.update({
                demoVideos: firebase.firestore.FieldValue.arrayUnion(...[{
                    id: u,
                    thumbnailUrl: boib,
                    videoUrl: boic,
                    title: leacture,
                    url: '...',
                    demo:Demo,
                    sec_id:sec_id
                    // url: req.body.url
                }])
            });
            //add lecture copy in main lecture
            // const Ref = dbs.collection('courses/' + id + '/sections/').doc(sec_id);
            // Ref.update({

            //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
            //         id: u,
            //         lectureThumbnail: boib,
            //         // picKey: loac,
            //         // vidKey: location, 
            //         lectureVideoUrl: boic,
            //         title: leacture, 
            //         url: '...',
            //         demo:Demo
            //         // title: leacture, url: req.body.url
            //     }])
            // });
            // end--
            console.log(req.body);

            res.redirect(`/screen/GetSection/${id}/${sec_id}/${title}`);
        }

    }, 1000)

    }else{
        res.redirect('/screen/signin')
    }
    
    
        //  
})



// /screen/notification
router.get('/notification',auth, (req, res) => {
    if(firebase.auth().currentUser){
res.render('screen/notification');
    }else{
        res.redirect('/screen/signin')
    }


    
})

// /screen/notification
router.post('/notification',auth, async (req, res) => {
    if(firebase.auth().currentUser){
  
    let text = req.body.text;
    let user;
    // >
    let users= await dbs.collection('users').get();
    //  console.log(users);
    
    //  users.docs.forEach((a)=>{
    //      console.log(a.id);
    //  })

    users.docs.forEach((user)=>{
        // console.log(user.id);
        dbs.collection('users').doc(user.id).update({
            notifications: firebase.firestore.FieldValue.arrayUnion({
                date:new Date(),
                notification:text
            })
        })
    })
    res.redirect('/screen/notification');
    }else{
        res.redirect('/screen/signin')
    }
    
  
})


// viewCourse
router.get('/viewCourse/:id',auth,async (req,res)=>{
    if(firebase.auth().currentUser){

    // /view/id
    // console.log(req.params.id)
    let id = req.params.id;
    let d =dbs.collection('courses').doc(id);
    data= await d.get();
    if(!data){
        console.log('no doc!')
    }
    else{
     console.log(data.id)
     
     data=data
        res.render('screen/viewCourse',{data:data})
    }

    }else{
        res.redirect('/screen/signin')
    }
   
   
})

// privacyPolicy
router.get('/privacyPolicy',auth, async(req,res)=>{
    if(firebase.auth().currentUser){
 let ref= dbs.collection('app').doc('termsOfUse');
    ref= await ref.get();
    let termsOfUse= ref.data().terms;
    let ref2= dbs.collection('app').doc('privacyPolicy');
    ref2= await ref2.get();
    let privacyPolicy= ref2.data().privacy;

    res.render('screen/privacyPolicy',{termsOfUse:termsOfUse,privacyPolicy:privacyPolicy});
    }else{
        res.redirect('/screen/signin')
    }
    
    
   
})



router.post('/privacyPolicy',auth,async (req,res)=>{
    if(firebase.auth().currentUser){
 let privacyPolicy= req.body.privacyPolicy;
//  let number = req.body.number; 

   dbs.collection('privacy').add({
       item:privacyPolicy,
    //    number:number
    timestamp:new Date()
    }).then(()=>{
        res.redirect('/screen/privacyPolicy');
    })
    }else{
        res.redirect('/screen/signin')
    }
   
   
   
})
router.post('/termsOfUse',auth,async (req,res)=>{
    if(firebase.auth().currentUser){
 let termsOfUse = req.body.termsOfUse;
//  let number = req.body.number;
    dbs.collection('terms').add({
         item:termsOfUse,
        //  number:number
        timestamp:new Date()
    }).then(()=>{
        res.redirect('/screen/privacyPolicy');
    })
    }else{
        res.redirect('/screen/signin')
    }
   
})


// token to view privacy and terms
router.get('/token/:token',auth, async(req,res)=>{
    if(firebase.auth().currentUser){
  let token= req.params.token;
    if(token == 'privacy' || token == 'terms'){
        
    dbs.collection(token).orderBy('timestamp', 'asc').get().then((snap)=>{
        let tokenData= snap;
        
        res.render('screen/privacyandTerms', {token:token, tokenData:tokenData});
    })
    }
    }else{
       res.redirect('/screen/signin')
    }
   
  
})


// Delete privacy or terms
router.get('/Delete_/:id/:token',auth, async(req,res)=>{
 if(firebase.auth().currentUser){
 let id = req.params.id;
 let token = req.params.token;

 if(token == 'privacy' || token == 'terms'){
    let ref = await dbs.collection(token).doc(id).delete().then(()=>{
        res.redirect(`/screen/token/${token}`);
    });
    
 }
 }else{
    res.redirect('/screen/signin')
 }

})




// signout
router.get('/signout/:signout', auth, async (req, res) => {
    try {
        console.log(req.params.signout);
        res.clearCookie('jwt_cookie');
        console.log('logout successfully');
        firebase.auth().signOut();
        res.redirect('/screen/signin');

    }
    catch (error) {
        res.status(500).send(error);
    }
});

// 
// var a = 'asdfasdfa';
// var b = a.length;
// console.log(b); 
// let txt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// let len = txt.length;
// console.log(len);
// 1248 get section awaiting changed
// EDIT LECTURE
// router.post('/Edit_Lecture', async (req, res) => {
//     console.log(req.body);
//     let uid = req.body.uid;
//     let id = req.body.id;
//     let sec_id = req.body.sec_id;
//     let title = req.body.title;
//     let old_title = req.body.old_title;
//     let lec_id = req.body.lec_id;
//     // let old_thumbnailUrl = req.body.old_thumbnailUrl;
//     // let old_lectureVideoUrl = req.body.old_lectureVideoUrl;



//     // res.send('working')

//     var fileb;
//     var filenameb;
//     let loac;
//     let boib;

//     // 2nd
//     let boic;
//     var filec;
//     var filenamec;
//     let location;
//     let the_data;

//     // 

//     // picture
//     if (req.files) {
//         if (req.files.lectureThumbnail !== undefined && req.files.lectureThumbnail.mimetype === 'image/png' || req.files.lectureThumbnail.mimetype === 'image/jpeg') {

//             setTimeout(function pic() {
//                 fileb = req.files.lectureThumbnail;
//                 filenameb = req.files.lectureThumbnail.name;
//                 console.log(fileb)
//                 loac = UUID();
//                 console.log(loac);
//                 fileb.mv('tmp/' + filenameb, async (err) => {
//                     boib = await upload('tmp/' + filenameb, loac);
//                     console.log('lecture Thumbnail updated here is the new value: ===>');
//                     console.log(boib);
//                     // dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({

//                     //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
//                     //         id:lec_id,
//                     //         lectureThumbnail:boib,
//                     //         id:id,
//                     //         title:title,
//                     //       //   lectureThumbnail:lectureThumbnail,

//                     //       }])
//                     // })

//                 })
//             }, 1)
//         }

//     }

//     // video 
//     if (req.files) {
//         if (req.files.lectureVideoUrl !== undefined && 'application/octet-stream') {

//             setTimeout(function b() {

//                 filec = req.files.lectureVideoUrl;
//                 filenamec = req.files.lectureVideoUrl.name;
//                 console.log(filec)
//                 location = UUID();
//                 console.log(location);
//                 filec.mv('tmp/' + filenamec, async (err) => {
//                     boic = await uploadf('tmp/' + filenamec, location);
//                     console.log('video thumbnail is updated here is the link:================>');
//                     console.log(boic);
//                     // dbs.collection('courses/'+id+'/sections/').doc(sec_id).update({
//                     //     lectures: firebase.firestore.FieldValue.arrayUnion(...[{
//                     //         id:id,
//                     //         title:title,
//                     //         lectureVideoKey:location,
//                     //         lectureVideoUrl:boic            

//                     //       }]) 

//                     // })

//                 })
//             }, 100)
//         }
//     }


//     // 

//     // test zone(*)
//     let save;
//     let Ref = dbs.collection('courses/' + id + '/sections').get(sec_id);
//     Ref.then((snap) => {

//         if (!snap) {
//             console.log('no doc');
//         } else {
//             snap.docs.forEach((doc) => {
//                 // console.log('we got this data>')
//                 // console.log(doc.data().lectures);
//                 save = doc.data().lectures;
//             })
//             console.log('results : ===>');

//             // save.forEach((doc)=>{
//             //     if(doc.title == old_title){
//             //         if(!req.files.lectureVideoUrl){location=doc.lectureVideoUrl,vidKey=location}
//             //         if(!req.files.lectureThumbnail){loac=doc.lectureThumbnail,picKey=loac}   

//             //         console.log(doc.title);
//             //     }

//             // })
//             setTimeout(function h() {
//                 the_data = save.map(item => {
//                     if (item.id == lec_id) {
//                         return {
//                             id: lec_id,
//                             title: title || item.title,
//                             picKey: loac || item.picKey,
//                             vidKey: location || item.vidKey,
//                             lectureThumbnail: boib || item.lectureThumbnail,
//                             lectureVideoUrl: boic || item.lectureVideoUrl
//                         }
//                     } else {
//                         return item
//                     }
//                 })
//             }, 7000)
//             console.log(the_data);
//             // update image video and text: ps both keys

//             // let obj = JSON.stringify(the_data); 
//             // res.send(obj.getString('title'));

//         }
//         setTimeout(function live() {
//             let ref = dbs.collection('courses/' + id + '/sections/').doc(sec_id);
//             ref.update({
//                 lectures: the_data
//             });

//         }, 9000)
//     })

//     let ok;
//     dbs.collection('courses/' + id + '/sections').get(sec_id).then((snap) => {
//         ok = snap
//         ok.docs.forEach((item) => {
//             // console.log();
//             ok = item.data().title;
//         })
//     })

//     //  res.redirect(`/screen/GetSection/${id}/${sec_id}/${ok}`);
//     setTimeout(() => {
//         res.redirect(`/screen/GetSection/${id}/${sec_id
//             }/${uid}`)
//     }, 10000)

// })

module.exports = router





// DELETE WHOLE COLLECTION CODE
// await dbs
// .collection(type)
// .get()
// .then((querySnapshot) => {
// querySnapshot.forEach((doc) => {
//   doc.ref.delete();
// });
// });

// function lanat(Lan){

//      for(i=1;i<Lan;i++)
//         { console.log('Lanat!');}
//                         } 
//         lanat(100);
