// CHECK ARRAY LENGTH (IS NULL OR NOT)
export const checkArrayLength = (array) => {
    if(!array){
        return false;
    }else{
        if(array.length > 0){
            return true
        }else{
            return false
        }
    }
}