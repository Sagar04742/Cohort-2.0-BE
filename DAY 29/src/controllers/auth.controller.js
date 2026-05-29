
export async function register(req,res,next){
    try{
        throw new Error('Encounter an error while registering user')
    }catch(err){
        next(err)
    }
}