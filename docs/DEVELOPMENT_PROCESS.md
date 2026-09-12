# CareerForge 开放开发文档

> 状态：**Living Document / 持续更新**  
> Owner：Engineering  
> 最后更新：2026-09-12
> 规则：任何影响用户、数据、API 或运维的变更，必须先更新本文档或关联 RFC，再进入实现。

## 1. 企业级交付流程

```text
需求发现 → PRD/验收标准 → RFC/风险评审 → 分支开发 → 自动化门禁
       → 代码评审 → 发布检查 → 部署/回滚 → 指标复盘 → 文档归档
```

### 阶段与责任

| 阶段 | 必须产物 | Exit Criteria |
|---|---|---|
| Discovery | 用户问题、目标指标、非目标 | 范围可验证且无隐含需求 |
| Design | RFC、API 合约、数据与安全评审 | 风险和回滚路径明确 |
| Build | 小批量提交、测试、日志更新 | 验收标准全部有实现映射 |
| Verify | lint、类型、单测、构建、smoke | 所有门禁通过且无已知 P0/P1 |
| Review | 自审清单、PR 描述、变更证据 | reviewer 可独立复现 |
| Release | 版本、发布说明、回滚步骤 | 主分支可部署、可观察、可回滚 |
| Learn | 指标和事故复盘 | 结论进入 backlog/RFC |

## 2. 分支、提交与评审

- `main` 始终保持可发布；功能分支命名 `codex/<ticket>-<summary>`。
- Conventional Commits：`feat:`、`fix:`、`docs:`、`test:`、`refactor:`、`chore:`。
- PR 必须说明 Why / What / Validation / Risk / Rollback，并链接 RFC。
- 禁止绕过 CI；紧急修复也要补测试和事后复盘。
- 合并策略：squash merge；发布以语义版本标签记录。

## 3. Definition of Done

- 用户验收标准全部满足，无未记录的行为变化。
- 新增边界经过运行时校验；错误不泄露内部细节。
- 单元、类型、lint、生产构建和 smoke test 全部通过。
- 安全、隐私、可访问性和失败路径已检查。
- README、架构、API、工程日志和发布说明同步更新。
- 变更可回滚，数据迁移具备向前/向后策略。

## 4. 质量门禁

每个 PR 和 `main` push 自动执行：

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. `npm audit --audit-level=high`

生产化阶段追加端到端测试、SAST、Secret Scan、容器扫描和部署 smoke test。

## 5. 严重性与 SLO

| 等级 | 定义 | 响应目标 |
|---|---|---|
| P0 | 数据泄露、全站不可用、不可逆数据损坏 | 立即响应，停止发布 |
| P1 | 核心分析或管道功能不可用 | 1 小时内响应 |
| P2 | 有替代路径的功能缺陷 | 下一迭代修复 |
| P3 | 体验或文档问题 | 进入 backlog |

MVP 服务目标：月可用性 99.5%；API p95 < 800ms（不含模型推理）；5xx < 1%。当前本地版通过请求日志提供观测基础，托管阶段接入 metrics/tracing。

## 6. 当前变更状态

| RFC | 内容 | 状态 | 发布 |
|---|---|---|---|
| RFC-001 | Enterprise Delivery Baseline | Verified | v1.1.0 |
| RFC-002 | Application Funnel Insights | Verified | v1.2.0 |

## 7. 决策日志

- 2026-09-11：采用 trunk-based delivery 与短生命周期功能分支。
- 2026-09-11：API 错误统一为带 `requestId` 的结构化 envelope。
- 2026-09-11：本地 JSON 继续作为 MVP 存储，但写入升级为临时文件 + 原子替换。
- 2026-09-11：写操作全部在服务端进行 Zod 校验，客户端类型不能替代信任边界。
- 2026-09-12：小样本漏斗使用精确计数与可解释转化率，不使用暗示预测能力的图表。

## 8. 下一轮候选工作

- P0：认证、租户隔离、Postgres 迁移和加密数据存储。
- P1：Playwright E2E、AI eval 数据集、OpenTelemetry、部署流水线。
- P1：简历 PDF/DOCX 导入、多个简历版本、数据导出和删除。
- P2：国际化、无障碍审计、漏斗指标和提醒系统。
