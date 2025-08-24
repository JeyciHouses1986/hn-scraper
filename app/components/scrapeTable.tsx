'use client';

import React from "react";
import { Entry } from "@/lib/types";

interface ScrapeTableProps {
  initialData?: Entry[];
}

export default function ScrapeTable({ initialData = [] }: ScrapeTableProps) {
    if (!initialData || initialData.length === 0) {
        return <div className="p-4">No data available</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Comments
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {initialData.map((entry, index) => (
                        <tr key={entry.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 border-b">
                                {entry.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                {entry.points}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                {entry.comments}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
