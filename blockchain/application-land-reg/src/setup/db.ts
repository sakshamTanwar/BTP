import mongoose from 'mongoose';

export class DbConnection {
    static dbname: string = 'lrsp_db';
    static uri: string = 'mongodb://localhost/rs_db';
    static mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    };

    static connect(): void {
        mongoose.connect(this.uri, this.mongoOptions, (err) => {
            if (err) {
                console.log('Database Connection Failed');
            } else console.log('Database Connection Established');
        });
    }
}
