const logger = require('../logger');


//After requiring our logger we create an error variable and set it to null. Later in this file if an error is 
//detected this value will be changed so that an appropriate error message can be sent to the user. 
const NO_ERRORS = null;


//When a POST or PATCH request is made and seeks to update or create a new tea clipping it is 
//necessary that we ensure those requests contain the needed data to create a valid new entry. This 
//helps avoid encountering errors in our code later when it is found an improper clipping was made. 
//Unless admins want to be responsible for monitoring each request that comes into the server, which 
//would realistically be impossible, this is a vital step to ensure the integrity of our data.   
function teaClippingValidator({ name, tea_type, caffeine, taste }) {

  //A name for Mr. TeaSeeks will only be considered valid if it is greater than 2 characters, and less than 
  //45. So if you recently enjoyed a tea named “The really super duper extra amazing best green tea ever”, 
  //try shortening that name just a little if you think it deserves a place in the Mr. TeaSeeks archive. 
  if (name.length < 2 || name.length > 45) {
    logger.error(`${name} length is shorter than 2 or greator than 45 `);
    return {
      error: {
        message: `The listed name for this Tea Clipping is '${name}'. Please provide a name that is greater than 2 characters, but less than 45.`
      }
    };
  }

  //If a new tea clipping attempts to be created and is not one of the current types we store in our archive 
  //it is rejected. Sorry Honeydew Tea, you aren’t for me! Or for Mr. TeaSeeks. At least not yet!
  
  const validTeaTypes = ['Black', 'Green', 'White', 'Berry', 'Chai', 'Herbal', 'Matcha', 'Oolong', 'Pu-Erh'];
  let teaIsValidType = false;

  validTeaTypes.forEach(tea => {

    if(tea_type === tea){
      teaIsValidType = true;
    }

  });

  if(teaIsValidType === false){
    return {
      error: {
        message: `Please supply a valid tea type for this tea clipping. You supplied ${tea_type}. Valid types are Black, Green, White, Berry, Chai, Herbal, Matcha, Oolong, Pu-Erh`
      }
    };
  }


  //Need a tea to sip before falling asleep? You don’t want a tea that has to much caffeine. 
  //Need something to wake you up in the morning? Something to light on caffeine just won’t do! 
  //This field is required so that users can make a choice and know that Mr. TeaSeeks will find the right 
  //tea for them. If a new entry does not provide a value for this field, it is rejected and returned.  
  if (caffeine !== 'High' && caffeine !== 'Low') {
    logger.error(`Caffeine level helps indicate if a tea is good for calming down, or waking you up. Please provide a caffeine level of "High" or "Low"`);
    return {
      error: {
        message: `Caffeine level helps indicate if a tea is good for calming down, or waking you up. Please provide a caffeine level of "High" or "Low"`
      }
    };
  }

  //A Matcha tea can have a strong, bitter taste and is one that I personally find very appealing though. 
  //Many others however find a traditional matcha tea much to strong, even to the point of being off 
  //putting. Since there is a perfect tea for everyone, we make sure that all Mr. TeaSeeks tea clippings 
  //indicate whether they have a strong or light flavor.
  if (taste !== 'Strong' && taste !== 'Light') {
    logger.error(`Taste supplied was not Strong Or Light`);
    return {
      error: {
        message: `It's important to know if a tea has "Strong" or "Light" taste so that tea clippings in this archive can be targeted for users who have a preference for one type or the other. Please provide "Strong" or Light" taste.`
      }
    };
  }

  return NO_ERRORS;
}

module.exports = {
  teaClippingValidator,
};
