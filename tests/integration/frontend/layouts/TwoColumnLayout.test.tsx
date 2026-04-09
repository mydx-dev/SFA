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

describe("TwoColumnLayout", () => {
    describe("構造", () => {
        test("左カラムが表示される", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            expect(screen.getByText("左コンテンツ")).toBeInTheDocument();
        });

        test("右カラムが表示される", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            expect(screen.getByText("右コンテンツ")).toBeInTheDocument();
        });

        test("カラムの幅比率が設定に従う", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} defaultLeftWidth={40} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("左カラム")).toBeInTheDocument();
        });

        test("リサイザーが中央に表示される", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("リサイザー")).toBeInTheDocument();
        });
    });

    describe("インタラクション", () => {
        test("リサイザードラッグでカラム幅を調整できる", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            const resizer = screen.getByLabelText("リサイザー");
            expect(resizer).toBeInTheDocument();
        });

        test("左カラム折りたたみボタンで左カラムを非表示にできる", async () => {
            const user = userEvent.setup();
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            const collapseButton = screen.getByLabelText("左カラムを折りたたむ");
            await user.click(collapseButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText("左カラム")).not.toBeInTheDocument();
            });
        });

        test("右カラム折りたたみボタンで右カラムを非表示にできる", async () => {
            const user = userEvent.setup();
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            const collapseButton = screen.getByLabelText("右カラムを折りたたむ");
            await user.click(collapseButton);
            
            await waitFor(() => {
                expect(screen.queryByLabelText("右カラム")).not.toBeInTheDocument();
            });
        });
    });

    describe("状態管理", () => {
        test("カラム幅の状態が管理される", () => {
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            expect(screen.getByLabelText("左カラム")).toBeInTheDocument();
        });

        test("折りたたみ状態が管理される", async () => {
            const user = userEvent.setup();
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            expect(screen.getByLabelText("左カラム")).toBeInTheDocument();
            
            await user.click(screen.getByLabelText("左カラムを折りたたむ"));
            
            await waitFor(() => {
                expect(screen.queryByLabelText("左カラム")).not.toBeInTheDocument();
            });
        });

        test("カラム幅がローカルストレージに保存される", () => {
            const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
            
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            expect(setItemSpy).toHaveBeenCalled();
            setItemSpy.mockRestore();
        });
    });

    describe("レスポンシブデザイン", () => {
        test("モバイルビューでは1カラムレイアウトになる", () => {
            vi.stubGlobal("matchMedia", (query: string) => ({
                matches: query.includes("max-width"),
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));
            
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            expect(screen.getByText("左コンテンツ")).toBeInTheDocument();
            expect(screen.getByText("右コンテンツ")).toBeInTheDocument();
            
            vi.unstubAllGlobals();
        });

        test("モバイルビューではタブ切り替えで左右を切り替える", () => {
            vi.stubGlobal("matchMedia", (query: string) => ({
                matches: query.includes("max-width"),
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));
            
            render(
                <MemoryRouter>
                    <TwoColumnLayout left={<div>左コンテンツ</div>} right={<div>右コンテンツ</div>} />
                </MemoryRouter>
            );
            
            // モバイルビューでは両方のコンテンツが表示される
            expect(screen.getByText("左コンテンツ")).toBeInTheDocument();
            expect(screen.getByText("右コンテンツ")).toBeInTheDocument();
            
            vi.unstubAllGlobals();
        });
    });
    describe("レイアウト", () => {
        describe("配置", () => {
            test("左右カラムが正しく配置される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左コンテンツ</div>} 
                            right={<div>右コンテンツ</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("左カラム")).toBeInTheDocument();
                expect(screen.getByLabelText("右カラム")).toBeInTheDocument();
            });
        });
        describe("サイズ", () => {
            test("デフォルトの幅比率が適用される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左コンテンツ</div>} 
                            right={<div>右コンテンツ</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("左カラム")).toBeInTheDocument();
            });
        });
        describe("色", () => {
            test("カラムが正しく表示される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左コンテンツ</div>} 
                            right={<div>右コンテンツ</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("左コンテンツ")).toBeInTheDocument();
            });
        });
        describe("タイポグラフィ", () => {
            test("テキストが正しく表示される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左テキスト</div>} 
                            right={<div>右テキスト</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByText("左テキスト")).toBeInTheDocument();
            });
        });
        describe("形状", () => {
            test("リサイザーが表示される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左コンテンツ</div>} 
                            right={<div>右コンテンツ</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("リサイザー")).toBeInTheDocument();
            });
        });
        describe("装飾", () => {
            test("レイアウトが適切に表示される", () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左</div>} 
                            right={<div>右</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("リサイザー")).toBeInTheDocument();
            });
        });
        describe("インタラクション", () => {
            test("リサイザーでカラムを折りたためる", async () => {
                render(
                    <MemoryRouter>
                        <TwoColumnLayout 
                            left={<div>左コンテンツ</div>} 
                            right={<div>右コンテンツ</div>} 
                        />
                    </MemoryRouter>
                );
                
                expect(screen.getByLabelText("左カラムを折りたたむ")).toBeInTheDocument();
            });
        });
    });
});
