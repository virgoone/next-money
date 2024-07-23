import React from "react";

import { Table } from "@/components/data-table";
import { SearchParams } from "@/components/data-table/types";

import { getBySearch } from "./_lib/queries";
import { searchParamsSchema } from "./_lib/validations";
import { getColumns } from "./_mods/columns";
import { TableToolbarActions } from "./_mods/toolbar-action";

export interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function AdminChargeProductPage({
  searchParams,
}: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams);

  const searchPromise = getBySearch(search);

  return (
    <>
      <Table
        getColumns={getColumns}
        toolbarElement={<TableToolbarActions />}
        searchPromise={searchPromise}
      />
    </>
  );
}
