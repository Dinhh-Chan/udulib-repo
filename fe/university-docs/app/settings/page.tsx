"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Moon, Sun, Globe, Bell, Shield, Palette } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [language, setLanguage] = useState("vi")

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Cài đặt</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
          <p className="text-muted-foreground">Tùy chỉnh giao diện và trải nghiệm của bạn</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent space-y-1">
                <TabsTrigger
                  value="appearance"
                  className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-muted"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Giao diện
                </TabsTrigger>
                <TabsTrigger
                  value="language"
                  className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-muted"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Ngôn ngữ
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-muted"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Thông báo
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="justify-start px-3 py-2 h-9 font-normal data-[state=active]:bg-muted"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Quyền riêng tư
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1">
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Giao diện</CardTitle>
                    <CardDescription>Tùy chỉnh giao diện và chủ đề của trang web</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Chủ đề</Label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-background rounded-md border"></div>
                          </div>
                          <RadioGroup defaultValue="light" className="flex">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="light" id="theme-light" />
                              <Label htmlFor="theme-light" className="cursor-pointer">
                                Sáng
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-black rounded-md border border-gray-800"></div>
                          </div>
                          <RadioGroup defaultValue="dark" className="flex">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dark" id="theme-dark" />
                              <Label htmlFor="theme-dark" className="cursor-pointer">
                                Tối
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className="border rounded-md p-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-gradient-to-b from-white to-black rounded-md border"></div>
                          </div>
                          <RadioGroup defaultValue="system" className="flex">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="system" id="theme-system" />
                              <Label htmlFor="theme-system" className="cursor-pointer">
                                Hệ thống
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="color-scheme">Chế độ màu tối</Label>
                        <p className="text-sm text-muted-foreground">Chuyển đổi giữa chế độ sáng và tối</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch id="color-scheme" />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="font-size">Cỡ chữ</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="font-size">
                          <SelectValue placeholder="Chọn cỡ chữ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Nhỏ</SelectItem>
                          <SelectItem value="medium">Vừa</SelectItem>
                          <SelectItem value="large">Lớn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="language" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Ngôn ngữ</CardTitle>
                    <CardDescription>Thay đổi ngôn ngữ hiển thị của trang web</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Ngôn ngữ hiển thị</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Chọn ngôn ngữ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="date-format">Định dạng ngày tháng</Label>
                      <Select defaultValue="dd/mm/yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Chọn định dạng ngày tháng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                    <CardDescription>Quản lý cài đặt thông báo</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Thông báo trên trang web</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="document-notifications">Thông báo về tài liệu</Label>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo khi tài liệu của bạn được duyệt hoặc có bình luận mới
                            </p>
                          </div>
                          <Switch id="document-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="forum-notifications">Thông báo về diễn đàn</Label>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo khi có trả lời cho bài viết của bạn
                            </p>
                          </div>
                          <Switch id="forum-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="system-notifications">Thông báo hệ thống</Label>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo về cập nhật hệ thống và bảo trì
                            </p>
                          </div>
                          <Switch id="system-notifications" defaultChecked />
                        </div>
                      </div>

                      <Separator />

                      <h3 className="text-lg font-medium">Thông báo qua email</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-document-notifications">Thông báo về tài liệu</Label>
                            <p className="text-sm text-muted-foreground">Nhận email khi tài liệu của bạn được duyệt</p>
                          </div>
                          <Switch id="email-document-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-forum-notifications">Thông báo về diễn đàn</Label>
                            <p className="text-sm text-muted-foreground">
                              Nhận email khi có trả lời cho bài viết của bạn
                            </p>
                          </div>
                          <Switch id="email-forum-notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-newsletter">Bản tin</Label>
                            <p className="text-sm text-muted-foreground">Nhận email về các cập nhật và tính năng mới</p>
                          </div>
                          <Switch id="email-newsletter" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Quyền riêng tư</CardTitle>
                    <CardDescription>Quản lý cài đặt quyền riêng tư của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Hiển thị hồ sơ</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="profile-visibility">Hiển thị hồ sơ công khai</Label>
                            <p className="text-sm text-muted-foreground">Cho phép người dùng khác xem hồ sơ của bạn</p>
                          </div>
                          <Switch id="profile-visibility" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="activity-visibility">Hiển thị hoạt động</Label>
                            <p className="text-sm text-muted-foreground">
                              Hiển thị hoạt động gần đây của bạn cho người dùng khác
                            </p>
                          </div>
                          <Switch id="activity-visibility" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="document-visibility">Hiển thị tài liệu đã tải lên</Label>
                            <p className="text-sm text-muted-foreground">
                              Hiển thị danh sách tài liệu bạn đã tải lên trong hồ sơ công khai
                            </p>
                          </div>
                          <Switch id="document-visibility" defaultChecked />
                        </div>
                      </div>

                      <Separator />

                      <h3 className="text-lg font-medium">Dữ liệu và cookie</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="analytics-cookies">Cookie phân tích</Label>
                            <p className="text-sm text-muted-foreground">
                              Cho phép sử dụng cookie để phân tích cách bạn sử dụng trang web
                            </p>
                          </div>
                          <Switch id="analytics-cookies" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="personalization-cookies">Cookie cá nhân hóa</Label>
                            <p className="text-sm text-muted-foreground">
                              Cho phép sử dụng cookie để cá nhân hóa trải nghiệm của bạn
                            </p>
                          </div>
                          <Switch id="personalization-cookies" defaultChecked />
                        </div>
                      </div>

                      <Separator />

                      <div className="pt-4">
                        <Button variant="outline">Tải xuống dữ liệu của tôi</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
