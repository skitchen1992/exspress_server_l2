import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import { getBlogsController } from '../controllers';

export const postsRouter = Router({})

postsRouter.get(PATH_URL.POSTS, getBlogsController);
