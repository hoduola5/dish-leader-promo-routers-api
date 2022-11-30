const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Promotion Created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId/comments')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotions) => {
        if(promotions != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo.comments);
        }
        else{
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        if(promo != null){
            promo.comments.push(req.body);
            promo.save()
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err));
        }
        else{
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions'
    + req.params.promoId + '/comments');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then((promo) => {
        if(promo != null){
           for(var i = (promo.comments.length -1); i >= 0; i--){
            promo.comments.id(promo.comments[i]._id).remove();
           }
           promo.save()
           .then((promo) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promo);
           }, (err) => next(err));
        }
        else{
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promoId/comments/:commentId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        if(promo != null && promo.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo.comments.id(req.params.commentId));
        }
        else if(promo == nul){
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        if(promo != null && promo.comments.id(req.params.commentId) != null){
            if(req.body.rating){
                promo.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                promo.comments.id(req.params.commentId).comment = req.body.comment;
            }
            promo.save()
           .then((promo) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promo);
           }, (err) => next(err));
        }
        else if(promo == nul){
            err = new Error('Dish ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((promo) => {
        if(promo != null && comments.id(req.params.commentId) != null){
            promo.comments.id(req.params.commentId).remove();
            promo.save()
           .then((promo) => {
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(promo);
           }, (err) => next(err));
        }
        else if(promo == nul){
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;

