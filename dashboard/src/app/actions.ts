"use server";

import { calculateGraphLayout } from "@/utils/graph/calculateGraphLayout";

export async function calculateGraphLayoutServer(graph : object, rootKey: string) {
    return calculateGraphLayout(graph, rootKey);
}