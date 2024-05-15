import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateAccountDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// also we can use the cors here for this whole user.routes.js file  by using the => router.use(cors())  // Apply middleware to all routes on the router

//MIDDLEWARE FOR A WHOLE  routes on the router ===>>> router.use(verifyJWT)  // Apply middleware to all routes on the router

// The difference between router.use() and app.use() lies in how they are used and where they apply within an Express application:

// app.use(): This method is used to mount middleware functions at a specified path for all HTTP methods. It is called on the main app object and applies to all routes and sub-routers defined after it in the middleware stack. For example, if you use app.use(cors()), it will enable CORS for all routes in your application.

// router.use(): This method is similar to app.use(), but it is used to mount middleware functions on a router instance. It only applies to routes that are defined on that specific router instance. This allows you to group related routes together and apply middleware specifically to those routes. For example, if you have a router for /api, using router.use(cors()) will enable CORS for all routes defined on that router (e.g., /api/users, /api/posts, etc.).

// In summary, app.use() is used for middleware that should apply globally to all routes in your application, while router.use() is used for middleware that should only apply to routes defined on a specific router.




//MIDDLEWARE FOR A SPECIFIC ROUTE ==========>router.route("/logout").post(verifyJWT, logoutUser)

// Yes, you can use router.route("/logout").post(verifyJWT, logoutUser) to mount middleware for a specific route on a router instance. Here's what this line does:

// router.route("/logout"): This sets up a new route for the /logout path on the router instance. This route will only match POST requests to /logout.
// .post(verifyJWT, logoutUser): This specifies the middleware and the request handler for the route. verifyJWT is a middleware function that will be executed first to verify the JWT token, and logoutUser is the request handler that will be called to handle the POST request.
// So, in this case, verifyJWT is the middleware that is mounted for the /logout route, and logoutUser is the request handler that will be called after the middleware has completed its execution.









// So, in summary, the MIDDLEWARE CHAIN for the /api/v1/users/register route is: ========>>>>>>>>>>>>>>>>
// app.use("/api/v1/users", userRouter) in app.js
// upload.fields([...]) middleware in user.routes.js
// registerUser request handler in user.routes.js


//here  the middleware is upload.fields([...]). The registerUser function is the request handler function that will be called after the file uploads have been processed. It is not a middleware in this context; instead, it is the final handler that will process the request and generate a response.
router.route("/register").post(                     
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

    
    router.route("/login").post(loginUser)
    
//secured routes
 //router.get('/logout', verifyJWT, getWatchHistory);         // Define the route using router.get() with middleware and route handler

router.route("/logout").post(verifyJWT,  logoutUser)        //define the route using router.route() with middleware and route handler

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router