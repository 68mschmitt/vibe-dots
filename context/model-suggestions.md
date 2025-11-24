# Model Suggestions for OpenCode

This guide helps you choose the right model for your specific use case in OpenCode.

## Quick Reference

| Use Case | Recommended Model | Alternative |
|----------|------------------|-------------|
| **General Development** | `opencode/gpt-5-nano` | `opencode/big-pickle` |
| **Complex Refactoring** | `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0` | `amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0` |
| **Quick Fixes & Edits** | `opencode/gpt-5-nano` | `amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0` |
| **Code Reviews** | `amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0` | `opencode/grok-code` |
| **Documentation** | `amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0` | `opencode/big-pickle` |
| **Debugging** | `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0` | `opencode/grok-code` |
| **Budget-Conscious** | `amazon-bedrock/amazon.nova-micro-v1:0` | `amazon-bedrock/meta.llama3-8b-instruct-v1:0` |
| **Large Codebases** | `amazon-bedrock/meta.llama3-70b-instruct-v1:0` | `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0` |

---

## Detailed Model Recommendations

### OpenCode Models

These are proprietary models optimized specifically for OpenCode workflows.

#### `opencode/gpt-5-nano`
**Best for:** General-purpose development, quick tasks, everyday coding

**Strengths:**
- Fast response times
- Excellent for common development tasks
- Well-balanced performance and speed
- Low latency

**Ideal Use Cases:**
- Writing new functions
- Quick bug fixes
- Simple refactoring
- Code explanations
- Unit test generation

**When to use:** This should be your default model for most development tasks.

---

#### `opencode/big-pickle`
**Best for:** Balanced performance across diverse tasks

**Strengths:**
- Versatile across multiple programming languages
- Good at understanding context
- Reliable for medium-complexity tasks
- Consistent quality

**Ideal Use Cases:**
- Multi-file refactoring
- API integration
- Documentation generation
- Project scaffolding
- Configuration file updates

**When to use:** When you need reliable performance across various task types.

---

#### `opencode/grok-code`
**Best for:** Code analysis and understanding

**Strengths:**
- Deep code understanding
- Excellent at pattern recognition
- Strong debugging capabilities
- Good for code reviews

**Ideal Use Cases:**
- Code reviews
- Identifying anti-patterns
- Security vulnerability detection
- Performance optimization suggestions
- Architecture analysis

**When to use:** When you need deep insight into existing code.

---

### Amazon Bedrock - Anthropic Claude Models

These models offer state-of-the-art reasoning capabilities from Anthropic.

#### Claude 4.x Opus Models

##### `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0`
**Best for:** Most complex development tasks requiring maximum intelligence

**Strengths:**
- Highest reasoning capability
- Excellent at complex problem-solving
- Superior code architecture decisions
- Best for intricate debugging

**Ideal Use Cases:**
- Complex system design
- Architectural refactoring
- Difficult bugs requiring deep analysis
- Performance optimization
- Migration between frameworks
- Security audits

**Trade-offs:**
- Higher cost
- Slightly slower response times
- May be overkill for simple tasks

**When to use:** When quality and correctness are paramount, and you're dealing with complex, mission-critical code.

---

##### `amazon-bedrock/anthropic.claude-opus-4-20250514-v1:0`
**Best for:** Complex tasks with slightly faster response than latest Opus

**Strengths:**
- High reasoning capability
- Good balance of speed and intelligence
- Strong at multi-step problems

**Ideal Use Cases:**
- Similar to claude-opus-4-1, but when you need faster iteration
- Complex but time-sensitive tasks

**When to use:** When you need Opus-level intelligence but with better response times.

---

#### Claude 4.x Sonnet Models

##### `amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0`
**Best for:** Best all-around model for professional development (HIGHLY RECOMMENDED)

**Strengths:**
- Excellent balance of speed, cost, and capability
- Very strong reasoning
- Great for production code
- Fast enough for iterative development

**Ideal Use Cases:**
- Professional development work
- Code reviews
- Medium to complex refactoring
- API development
- Test suite creation
- Documentation with code examples
- CI/CD pipeline setup

**When to use:** This is the recommended model for most professional development work. Use it when you need high-quality results without the cost of Opus.

---

##### `amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0`
**Best for:** Reliable mid-tier performance

**Strengths:**
- Good reasoning capability
- Balanced performance
- Reliable outputs

**Ideal Use Cases:**
- General development
- Documentation
- Code generation
- Moderate refactoring

**When to use:** Alternative to Sonnet 4.5 if you want a slightly older but stable model.

---

#### Claude 4.x Haiku Models

##### `amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0`
**Best for:** Fast, cost-effective coding tasks

**Strengths:**
- Very fast response times
- Cost-effective
- Good for simple tasks
- Quick iterations

**Ideal Use Cases:**
- Quick fixes
- Simple function writing
- Code formatting
- Basic refactoring
- Simple test generation
- Quick questions

**Trade-offs:**
- Less capable with complex reasoning
- Not ideal for architectural decisions

**When to use:** When speed and cost matter more than handling complexity.

---

#### Claude 3.x Models

##### `amazon-bedrock/anthropic.claude-3-7-sonnet-20250219-v1:0`
**Best for:** Previous generation high-quality model

**Strengths:**
- Solid performance
- Proven reliability
- Good for most tasks

**Ideal Use Cases:**
- General development when Claude 4 is unavailable
- Budget-conscious projects still needing quality

**When to use:** As a fallback when Claude 4 models are unavailable or too expensive.

---

##### `amazon-bedrock/anthropic.claude-3-5-haiku-20241022-v1:0`
**Best for:** Fast previous-generation model

**Strengths:**
- Quick responses
- Lower cost than Claude 4

**Ideal Use Cases:**
- Simple tasks
- Quick iterations
- When budget is tight

**When to use:** When you need the speed of Haiku but don't require Claude 4 capabilities.

---

### Amazon Bedrock - Meta Llama Models

#### `amazon-bedrock/meta.llama3-70b-instruct-v1:0`
**Best for:** Large context tasks on a budget

**Strengths:**
- Good performance for open-source model
- Larger context window useful for big codebases
- Cost-effective
- Decent reasoning for price point

**Ideal Use Cases:**
- Budget-conscious projects
- Working with large files
- Open-source projects
- Learning and experimentation
- Batch processing tasks

**Trade-offs:**
- Not as capable as Claude models
- May require more specific prompting
- Less consistent on complex tasks

**When to use:** When you have budget constraints but need to work with larger contexts.

---

#### `amazon-bedrock/meta.llama3-8b-instruct-v1:0`
**Best for:** Lightweight tasks on tight budget

**Strengths:**
- Very cost-effective
- Fast responses
- Good for simple tasks
- Low resource usage

**Ideal Use Cases:**
- Simple code generation
- Basic refactoring
- Learning projects
- High-volume simple tasks
- Prototyping

**Trade-offs:**
- Limited reasoning capability
- Not suitable for complex tasks
- May struggle with nuanced requirements

**When to use:** When cost is the primary concern and tasks are straightforward.

---

### Amazon Bedrock - Amazon Nova Models

#### `amazon-bedrock/amazon.nova-micro-v1:0`
**Best for:** AWS-native lightweight tasks

**Strengths:**
- AWS-native integration
- Cost-effective
- Low latency within AWS
- Good for simple tasks

**Ideal Use Cases:**
- Simple AWS Lambda functions
- Basic AWS service integration
- Cost-sensitive AWS projects
- Simple automation scripts

**Trade-offs:**
- Limited capability compared to Claude
- Best suited for AWS-specific tasks
- Less general-purpose than other models

**When to use:** When working on AWS projects and needing a cost-effective model.

---

## Model Selection Decision Tree

```
Start Here
    ↓
Is cost a primary concern?
    ├─ YES → Budget Models
    │         ├─ Simple task → amazon-bedrock/amazon.nova-micro-v1:0
    │         ├─ Medium task → amazon-bedrock/meta.llama3-8b-instruct-v1:0
    │         └─ Complex/Large context → amazon-bedrock/meta.llama3-70b-instruct-v1:0
    │
    └─ NO → How complex is the task?
              ├─ Simple/Quick → opencode/gpt-5-nano
              │                  or amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0
              │
              ├─ Medium → opencode/big-pickle
              │            or amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0
              │
              └─ Complex → Is it mission-critical?
                           ├─ YES → amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0
                           └─ NO → amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0
```

---

## Performance Tiers

### Tier 1: Maximum Capability (Use for critical tasks)
1. `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0`
2. `amazon-bedrock/anthropic.claude-opus-4-20250514-v1:0`

### Tier 2: Professional Grade (Best for most work)
1. `amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0` ⭐ **RECOMMENDED**
2. `amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0`
3. `opencode/grok-code`
4. `opencode/big-pickle`

### Tier 3: Fast & Efficient (Daily development)
1. `opencode/gpt-5-nano` ⭐ **DEFAULT CHOICE**
2. `amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0`
3. `amazon-bedrock/anthropic.claude-3-7-sonnet-20250219-v1:0`

### Tier 4: Budget-Conscious (Cost-sensitive projects)
1. `amazon-bedrock/meta.llama3-70b-instruct-v1:0`
2. `amazon-bedrock/amazon.nova-micro-v1:0`
3. `amazon-bedrock/meta.llama3-8b-instruct-v1:0`

---

## Tips for Model Usage

### Switching Models Mid-Session
You can switch models during a conversation using:
```bash
opencode --model "model-name"
```

### Cost Optimization Strategy
1. Start with `opencode/gpt-5-nano` for exploration
2. Switch to `claude-sonnet-4-5` for implementation
3. Use `claude-opus-4-1` only for critical debugging or complex architecture

### Speed Optimization Strategy
1. Use Haiku models for rapid iteration
2. Switch to Sonnet for final implementation
3. Validate with Opus if needed

---

## Common Scenarios

### Scenario: Building a New Feature
1. **Planning phase:** `claude-sonnet-4-5` for architecture
2. **Implementation:** `opencode/gpt-5-nano` for coding
3. **Refinement:** `opencode/big-pickle` for polish
4. **Review:** `opencode/grok-code` for final review

### Scenario: Debugging Production Issue
1. **Investigation:** `claude-opus-4-1` for deep analysis
2. **Fix implementation:** `claude-sonnet-4-5` for reliable fix
3. **Testing:** `opencode/gpt-5-nano` for test generation

### Scenario: Documentation Sprint
1. `claude-sonnet-4` for comprehensive docs
2. `opencode/big-pickle` for quick updates

### Scenario: Open Source Contribution
1. **Understanding codebase:** `opencode/grok-code`
2. **Making changes:** `opencode/big-pickle`
3. **Writing tests:** `opencode/gpt-5-nano`

---

## Model Comparison Matrix

| Feature | OpenCode Models | Claude Opus 4 | Claude Sonnet 4 | Claude Haiku 4 | Llama 3 70B | Nova Micro |
|---------|----------------|---------------|-----------------|----------------|-------------|------------|
| **Speed** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ |
| **Reasoning** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Code Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Cost** | 💰💰 | 💰💰💰💰💰 | 💰💰💰💰 | 💰💰 | 💰 | 💰 |
| **Complex Tasks** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

*Last updated: Fri Nov 21 2025*  
*Based on testing results in model-test-summary.md*
