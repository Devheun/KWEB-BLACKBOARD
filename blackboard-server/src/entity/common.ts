import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Timestamp {
    @CreateDateColumn({type : 'timestamp'})
    createdAt: Date;
    
    @UpdateDateColumn({type : 'timestamp'})
    updatedAt: Date;
    
    @DeleteDateColumn({type : 'timestamp'})
    deletedAt: Date | null;
}