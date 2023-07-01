import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log('BAE DE DATOS CONECTADA');
    } catch (error) {
        // handleError(error);
        console.log(error);
    }
}

export default connectDB;