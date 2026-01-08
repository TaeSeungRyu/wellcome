import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './board.schema';
import { BoardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
  ],
  controllers: [],
  providers: [BoardService],
  exports: [],
})
export class BoardModule {}
