import { Router, Request, Response } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import serachHelper from "../../../helpers/search";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
    // Find 
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp,
    }

    const find: Find = {
        deleted: false,
    }

    if(req.query.status) {
        find.status = req.query.status as string;
    }
    // End Find 

    // Search
    let objectSearch = serachHelper(req.query);

    if (req.query.keyword){
        find.title = objectSearch.regex;
    }

    // End Search

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    }

    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks,
    );
    // End Pagination

    // Sort
    const sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey as string;
        sort[sortKey] = req.query.sortValue as string;
    }
    // End Sort

    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
    
    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    });
    
    res.json(task);
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne({_id: id}, {status: status});

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tài!",
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key){
            case "status":
                await Task.updateMany(
                    {
                        _id: { $in: ids},
                    },
                    {
                        status: value,
                    }
                );
                
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!",
                });
                break;
            
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tài!",
                });
                break;
            }

        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tài!",
        });
    }
}