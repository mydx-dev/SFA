import { SheetDB } from "@mydx-dev/gas-boost-runtime";
import { SyncOutput } from "../../../shared/types/sync";
import { SystemUser } from "../../application/dto/SystemUser";
import {
    ALL_TABLES,
    SystemUserTable,
    LeadTable,
    DealTable,
    ActivityTable,
} from "../../infrastructure/SheetORM/tables";

export class SyncDataBaseUseCase {
    constructor(private db: SheetDB<typeof ALL_TABLES>) {}
    execute(user: SystemUser): SyncOutput {
        // バリデーション: ユーザーが存在するか確認
        const users = this.db
            .table("システムユーザー")
            .find(
                this.db
                    .query("システムユーザー")
                    .and("メールアドレス", "=", [user.email]),
            );

        if (users.length === 0) {
            throw new Error("ユーザーが存在しません");
        }

        // リードテーブルから担当者IDで絞り込んで検索
        const leads = this.db
            .table("リード")
            .find(
                this.db
                    .query("リード")
                    .and("担当者ID", "=", [user.id]),
            );

        // 案件テーブルから担当者IDで絞り込んで検索
        const deals = this.db
            .table("案件")
            .find(
                this.db
                    .query("案件")
                    .and("担当者ID", "=", [user.id]),
            );

        // 営業活動テーブルから担当者IDで絞り込んで検索
        const activities = this.db
            .table("営業活動")
            .find(
                this.db
                    .query("営業活動")
                    .and("担当者ID", "=", [user.id]),
            );

        // SyncOutput形式で全テーブルのデータを返す
        return [
            {
                table: SystemUserTable,
                records: users.map((user) => SystemUserTable.serialize(user)),
            },
            {
                table: LeadTable,
                records: leads.map((lead) => LeadTable.serialize(lead)),
            },
            {
                table: DealTable,
                records: deals.map((deal) => DealTable.serialize(deal)),
            },
            {
                table: ActivityTable,
                records: activities.map((activity) => ActivityTable.serialize(activity)),
            },
        ];
    }
}
