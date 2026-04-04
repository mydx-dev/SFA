import { SheetTable } from "@mydx-dev/gas-boost-runtime";
import { z } from "zod";
import { SystemUser } from "../../domain/entity/SystemUser.ts";
import { Lead } from "../../domain/entity/Lead.ts";
import { Deal } from "../../domain/entity/Deal.ts";
import { Activity } from "../../domain/entity/Activity.ts";

export const SystemUserTable = new SheetTable(
    "",
    "システムユーザー",
    z.object({
        ID: z.string().meta({ unique: true }),
        メールアドレス: z.string(),
    }),
    "ID",
    false,
    (record) => new SystemUser(record.ID, record.メールアドレス),
    (entity) => ({ ID: entity.id, メールアドレス: entity.email }),
);

export const LeadTable = new SheetTable(
    "",
    "リード",
    z.object({
        ID: z.string().meta({ unique: true }),
        氏名: z.string(),
        会社名: z.string().nullable(),
        メールアドレス: z.string().nullable(),
        電話番号: z.string().nullable(),
        ステータス: z.enum(["未対応", "対応中", "商談化", "失注", "顧客化"]),
        担当者ID: z.string().nullable(),
        作成日時: z.date(),
        更新日時: z.date(),
    }),
    "ID",
    false,
    (record) =>
        new Lead(
            record.ID,
            record.氏名,
            record.会社名,
            record.メールアドレス,
            record.電話番号,
            record.ステータス,
            record.担当者ID,
            record.作成日時,
            record.更新日時,
        ),
    (entity) => ({
        ID: entity.id,
        氏名: entity.name,
        会社名: entity.companyName,
        メールアドレス: entity.email,
        電話番号: entity.phoneNumber,
        ステータス: entity.status,
        担当者ID: entity.assigneeId,
        作成日時: entity.createdAt,
        更新日時: entity.updatedAt,
    }),
);

export const DealTable = new SheetTable(
    "",
    "案件",
    z.object({
        ID: z.string().meta({ unique: true }),
        案件名: z.string(),
        リードID: z.string(),
        ステータス: z.enum(["提案", "交渉", "クローズ(成功)", "クローズ(失敗)"]),
        金額: z.number().nullable(),
        予定クローズ日: z.date().nullable(),
        担当者ID: z.string(),
        作成日時: z.date(),
        更新日時: z.date(),
    }),
    "ID",
    false,
    (record) =>
        new Deal(
            record.ID,
            record.案件名,
            record.リードID,
            record.ステータス,
            record.金額,
            record.予定クローズ日,
            record.担当者ID,
            record.作成日時,
            record.更新日時,
        ),
    (entity) => ({
        ID: entity.id,
        案件名: entity.dealName,
        リードID: entity.leadId,
        ステータス: entity.status,
        金額: entity.amount,
        予定クローズ日: entity.expectedCloseDate,
        担当者ID: entity.assigneeId,
        作成日時: entity.createdAt,
        更新日時: entity.updatedAt,
    }),
);

export const ActivityTable = new SheetTable(
    "",
    "営業活動",
    z.object({
        ID: z.string().meta({ unique: true }),
        案件ID: z.string(),
        活動種別: z.enum(["面談", "電話", "メール", "その他"]),
        活動日: z.date(),
        内容: z.string(),
        担当者ID: z.string(),
        作成日時: z.date(),
        更新日時: z.date(),
    }),
    "ID",
    false,
    (record) =>
        new Activity(
            record.ID,
            record.案件ID,
            record.活動種別,
            record.活動日,
            record.内容,
            record.担当者ID,
            record.作成日時,
            record.更新日時,
        ),
    (entity) => ({
        ID: entity.id,
        案件ID: entity.dealId,
        活動種別: entity.activityType,
        活動日: entity.activityDate,
        内容: entity.content,
        担当者ID: entity.assigneeId,
        作成日時: entity.createdAt,
        更新日時: entity.updatedAt,
    }),
);

// Relations
LeadTable.reference("担当者ID", SystemUserTable, "ID", "set null");
DealTable.reference("リードID", LeadTable, "ID", "cascade");
DealTable.reference("担当者ID", SystemUserTable, "ID", "set null");
ActivityTable.reference("案件ID", DealTable, "ID", "cascade");
ActivityTable.reference("担当者ID", SystemUserTable, "ID", "set null");

export const ALL_TABLES = [SystemUserTable, LeadTable, DealTable, ActivityTable] as const;
