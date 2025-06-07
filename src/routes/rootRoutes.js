import userRouter from './userRoutes.js';
import projectRouter from './projectRoutes.js';
import categoryRouter from './categoryRoutes.js';

export default app => {
    app.use(userRouter);
    app.use("/api/projects", projectRouter);
    app.use("/api/categories", categoryRouter);
}