import { Review } from "../../models/Review.js"

export const createReview = async (req, res, next) => {
  try {
    const { pickupId, userId, vendorId, rating, comment } = req.body;

    if([pickupId,userId,vendorId,rating,comment].some((item)=>{
        return !item;
    })){
        res.status(401);
        throw new Error("All details are necessary")
    }

    const review = await Review.create({
        pickup : pickupId,
        user : userId,
        vendor : vendorId,
        rating : rating,
        comment : comment
    })

    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const { reviewId ,pickupId, userId, vendorId, rating, comment } = req.body;
    if(!reviewId && !pickupId){
        res.status(401);
        throw new Error("Please provide ReviewId or pickupId")
    }
    if(req.isVendor){
      res.status(401);;
      throw new Error("Vendor is not authorized to update a review");
    }
    let review = {}
    if(reviewId){
        review = await Review.findById(reviewId);
    }
    else {
        review = await Review.findOne({
        pickup : pickupId
        })
    }
    if(!review){
        res.status(401);
        throw new Error("Wrong reviewId provided")
    }

    review.pickup = pickupId?pickupId : review.pickup;
    review.user = userId?userId : review.user;
    review.vendor = vendorId?vendorId : review.vendor;
    review.rating = rating?rating: review.rating;
    review.comment = comment?comment : review.comment;
    
    await review.save();
    const updatedReview = await Review.findById(review._id);

    res.status(201).json(updatedReview);

  } catch (error) {
    next(error)
  }
}

export const getAllReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if(!userId){
        res.status(401);
        throw new Error("Unauthorized");
    }
    let reviews = [];
    if(req.isVendor){
        reviews = await Review.find({
            vendor : userId
        })
    }else{
        reviews = await Review.find({
            user : userId
        })
    }
    
    res.status(201).json({"data":reviews});

  } catch (error) {
    next(error)
  }
}

export const getReviewByPickup = async (req, res, next) => {
    try {
      const {pickupId} = req.params;
      if(!pickupId){
          res.status(401);
          throw new Error("Provide pickup Id");
      }

      const review = await Review.findOne({pickup:pickupId})

      if(!review){
        res.status(401);
        throw new Error("Wrong Id provided")
      }
      
      res.status(201).json(review);
  
    } catch (error) {
      next(error)
    }
  }
export const deleteReview = async (req, res, next) => {
    try {
      const {reviewId} = req.params;
      if(!reviewId){
          res.status(401);
          throw new Error("Provide reviewId");
      }

      const review = await Review.findById(reviewId);
      if(!review){
        res.status(401);
        throw new Error("Wrong Id provided")
      }

      await Review.deleteOne(review);

      res.status(201).json({
        message:`Review with id ${reviewId} deleted successfully`
      });
  
    } catch (error) {
      next(error)
    }
  }