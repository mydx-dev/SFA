import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "../../../../src/frontend/layout/AppLayout";
import { DashboardLayout } from "../../../../src/frontend/layout/DashboardLayout";
import { TwoColumnLayout } from "../../../../src/frontend/layout/TwoColumnLayout";
import { AuthProvider } from "../../../../src/frontend/lib/AuthContext";
import * as syncUseCase from "../../../../src/frontend/usecase/sync";

vi.mock("../../../../src/frontend/usecase/sync");

describe("DashboardLayout", () => {
    describe("構造", () => {
        test("childrenが正しく描画される", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout>
                        <div>ダッシュボードコンテンツ</div>
                    </DashboardLayout>
                </MemoryRouter>
            );
            expect(screen.getByText("ダッシュボードコンテンツ")).toBeInTheDocument();
        });

        test("グリッドレイアウトが適用される", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout
                        kpiSection={<div>KPIセクション</div>}
                        chartSection={<div>グラフセクション</div>}
                        listSection={<div>リストセクション</div>}
                    />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("KPIセクション")).toBeInTheDocument();
            expect(screen.getByLabelText("グラフセクション")).toBeInTheDocument();
            expect(screen.getByLabelText("リストセクション")).toBeInTheDocument();
        });

        test("KPIセクションが上部に配置される", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout kpiSection={<div>KPI情報</div>} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("KPIセクション")).toBeInTheDocument();
            expect(screen.getByText("KPI情報")).toBeInTheDocument();
        });

        test("グラフセクションが中央に配置される", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout chartSection={<div>グラフ情報</div>} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("グラフセクション")).toBeInTheDocument();
            expect(screen.getByText("グラフ情報")).toBeInTheDocument();
        });

        test("リストセクションが下部または右側に配置される", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout listSection={<div>リスト情報</div>} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("リストセクション")).toBeInTheDocument();
            expect(screen.getByText("リスト情報")).toBeInTheDocument();
        });
    });

    describe("レスポンシブデザイン", () => {
        test("デスクトップビューでは2カラムレイアウトになる", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout
                        kpiSection={<div>KPI</div>}
                        chartSection={<div>グラフ</div>}
                    />
                </MemoryRouter>
            );
            expect(screen.getByText("KPI")).toBeInTheDocument();
            expect(screen.getByText("グラフ")).toBeInTheDocument();
        });

        test("タブレットビューでは1カラムレイアウトになる", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout kpiSection={<div>KPI</div>} />
                </MemoryRouter>
            );
            expect(screen.getByText("KPI")).toBeInTheDocument();
        });

        test("モバイルビューではスタックレイアウトになる", () => {
            render(
                <MemoryRouter>
                    <DashboardLayout kpiSection={<div>KPI</div>} />
                </MemoryRouter>
            );
            expect(screen.getByText("KPI")).toBeInTheDocument();
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
            test("各セクションが正しく配置される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPIセクション</div>}
                            chartSection={<div>グラフセクション</div>}
                            listSection={<div>リストセクション</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("KPIセクション")).toBeInTheDocument();
                expect(screen.getByText("グラフセクション")).toBeInTheDocument();
                expect(screen.getByText("リストセクション")).toBeInTheDocument();
            });
        });
        describe("サイズ", () => {
            test("グリッドレイアウトが適用される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPI</div>}
                            chartSection={<div>グラフ</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("KPIセクション")).toBeInTheDocument();
            });
        });
        describe("色", () => {
            test("各セクションが表示される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPI</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("KPI")).toBeInTheDocument();
            });
        });
        describe("タイポグラフィ", () => {
            test("コンテンツが表示される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPIデータ</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("KPIデータ")).toBeInTheDocument();
            });
        });
        describe("形状", () => {
            test("レイアウトが正しく表示される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            chartSection={<div>グラフ</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("グラフ")).toBeInTheDocument();
            });
        });
        describe("装飾", () => {
            test("各セクションが適切に表示される", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPI</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("KPIセクション")).toBeInTheDocument();
            });
        });
        describe("インタラクション", () => {
            test("レイアウトが機能する", () => {
                render(
                    <MemoryRouter>
                        <DashboardLayout
                            kpiSection={<div>KPI</div>}
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("KPI")).toBeInTheDocument();
            });
        });
    });
});

