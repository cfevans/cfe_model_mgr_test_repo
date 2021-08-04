


module.exports.expressJSONEnvelope = function(req,res,next){
  //*Attach New Function to res.jsonWrapper

  const jsonEnvelope = (props) =>{
    if(props.data){
      const {data, error, alert, meta} = props
      return res.json({
        data, error, alert, meta
      })
    }else{
      return res.json({
        data: props,
      })
    }
  }

  res.jsonEnvelope = jsonEnvelope;
  next();



}