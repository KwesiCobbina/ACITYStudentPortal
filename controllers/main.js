const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('to get to a page, add to views and route to the filename without extension');
})
  
router.get('/:param', (req,res)=>{
    res.render(req.params.param+"");
})

module.exports = router;