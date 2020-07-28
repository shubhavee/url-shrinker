var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const shortId=require('shortid')

shortUrlSchema = new Schema( {

	// unique_id: Number,
	email: String,
	// username: String,
	// password: String,
	// passwordConf: String
  full:{
    type:String,
    // required:true
  },
  short:{
    type:String,
    // required:true,
    default:shortId.generate,
  },
  clicks:{
    type:Number,
    // required:true,
    default:0,
  }
}),

ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = ShortUrl;
