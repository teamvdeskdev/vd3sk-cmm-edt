OC.L10N.register(
    "files_antivirus",
    {
    "Clean" : "清除",
    "Infected" : "已被感染",
    "Unchecked" : "未选中",
    "Scanner exit status" : "扫描器退出状态",
    "Scanner output" : "扫描器输出",
    "Saving..." : "正在保存…",
    "Antivirus" : "反病毒",
    "File {file} is infected with {virus}" : "文件 {file} 被 {virus} 感染",
    "The file has been removed" : "文件已移除",
    "File containing {virus} detected" : "检测到包含 {virus} 的文件",
    "Antivirus detected a virus" : "反病毒检测到一个病毒",
    "Virus %s is detected in the file. Upload cannot be completed." : "在文件中检测到病毒 %s。上传未能完成。",
    "Saved" : "已保存",
    "Antivirus for files" : "文件反病毒",
    "An antivirus app for Nextcloud based on ClamAV" : "Nextcloud上一款基于ClamAV的反病毒应用",
    "Antivirus for files is an antivirus app for Nextcloud based on ClamAV.\n\n* 🕵️‍♂️ When the user uploads a file, it's checked\n* ☢️ Uploaded and infected files will be deleted and a notification will be shown and/or sent via email\n* 🔎 Background Job to scan all files\n\nThis application inspects files that are uploaded to Nextcloud for viruses before they are written to the Nextcloud storage. If a file is identified as a virus, it is either logged or not uploaded to the server. The application relies on the underlying ClamAV virus scanning engine, which the admin points Nextcloud to when configuring the application.\nFor this app to be effective, the ClamAV virus definitions should be kept up to date. Also note that enabling this app will impact system performance as additional processing is required for every upload. More information is available in the Antivirus documentation." : "文件反病毒是Nextcloud上一款基于ClamAV的反病毒应用。\n\n* 🕵️‍♂️ 当用户上传文件时，文件会被检测\n* ☢️ 上传且被感染的文件将被删除，同时会显示一个通知和/或发送一封邮件\n* 🔎 后台任务扫描所有文件\n\n此应用会在文件上传到Nextcloud但还没写入Nextcloud存储时对文件做病毒检查。如果一个文件被识别为病毒，它将记录到日志中或禁止被上传到服务器。此应用依赖下层的ClamAV病毒扫描引擎，管理员在配置应用时需要将Nextcloud指向它。\n此应用要起作用，ClamAV的病毒定义应保持更新到最新。同样需要注意的是启用此应用会影响系统性能，因为每次上传都要进行额外的处理。更多信息请参考反病毒应用的文档。",
    "Greetings {user}," : "您好 {user}，",
    "Sorry, but a malware was detected in a file you tried to upload and it had to be deleted." : "抱歉，在您试图上传的文件中检测到恶意软件，文件已被删除。",
    "This email is a notification from {host}. Please, do not reply." : "这封邮件是来自 {host} 的通知，请不要回复。",
    "File uploaded: {file}" : "文件已上传：{file}",
    "Antivirus for Files" : "文件反病毒",
    "Mode" : "模式",
    "Executable" : "可执行文件",
    "Daemon" : "后台进程",
    "Daemon (Socket)" : "后台进程（Socket）",
    "Socket" : "Socket",
    "Clamav Socket." : "Clamav Socket",
    "Not required in Executable Mode." : "在可执行文件模式中不需要",
    "Host" : "主机",
    "Address of Antivirus Host." : "反病毒主机的地址",
    "Port" : "端口",
    "Port number of Antivirus Host." : "反病毒主机的端口号",
    "Stream Length" : "数据流长度",
    "ClamAV StreamMaxLength value in bytes." : "ClamAV 数据流最大长度（字节）",
    "bytes" : "字节",
    "Path to clamscan" : "clamscan 路径",
    "Path to clamscan executable." : "clamscan 可执行文件路径",
    "Not required in Daemon Mode." : "在后台进程模式中不需要",
    "Extra command line options (comma-separated)" : "额外的命令行参数（逗号分隔）",
    "File size limit, -1 means no limit" : "文件大小限制，-1 意味着没有限制",
    "Background scan file size limit in bytes, -1 means no limit" : "后台扫描文件大小限制（字节），-1 意味着没有限制",
    "When infected files are found during a background scan" : "当在后台扫描中发现受感染文件时",
    "Only log" : "仅日志",
    "Delete file" : "删除文件",
    "Save" : "保存",
    "Advanced" : "高级",
    "Rules" : "规则",
    "Clear All" : "清除所有",
    "Reset to defaults" : "恢复默认值",
    "Match by" : "匹配",
    "Scanner exit status or signature to search" : "扫描器退出状态 或 要搜索的签名",
    "Description" : "描述",
    "Mark as" : "标记为",
    "Add a rule" : "添加规则"
},
"nplurals=1; plural=0;");
