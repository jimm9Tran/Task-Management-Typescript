import { Router, Request, Response } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";


export const index = async (req: Request, res: Response) => {
    // Find 
    interface Find {
        deleted: boolean,
        status?: string,
    }

    const find: Find = {
        deleted: false,
    }

    if(req.query.status) {
        find.status = req.query.status as string;
    }
    // End Find 

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

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false,
    });
    
    res.json(task);
}
