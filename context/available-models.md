# Available Models

This document contains a list of **tested and working** models for OpenCode.

> **Note:** This list was verified on Fri Nov 21 2025. Only models that successfully passed testing are included.
> See `model-test-summary.md` for detailed test results and `model-suggestions.md` for use case recommendations.

## OpenCode Models (3 models)

All OpenCode proprietary models are fully functional:

- `opencode/gpt-5-nano`
- `opencode/big-pickle`
- `opencode/grok-code`

## Amazon Bedrock Models

### Anthropic Claude Models (8 models)

**Note:** Only newer Claude 3.5+ and Claude 4.x models are supported. Older models have been deprecated or require prompt caching configurations not compatible with OpenCode.

#### Claude 3.5 Generation
- `amazon-bedrock/anthropic.claude-3-5-haiku-20241022-v1:0`

#### Claude 3.7 Generation
- `amazon-bedrock/anthropic.claude-3-7-sonnet-20250219-v1:0`

#### Claude 4.x Generation
- `amazon-bedrock/anthropic.claude-haiku-4-5-20251001-v1:0`
- `amazon-bedrock/anthropic.claude-sonnet-4-20250514-v1:0`
- `amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0`
- `amazon-bedrock/anthropic.claude-opus-4-20250514-v1:0`
- `amazon-bedrock/anthropic.claude-opus-4-1-20250805-v1:0`

### Meta Llama Models (2 models)

**Note:** Only base Llama 3 models work. Llama 3.1+, 3.2, 3.3, and 4.x require inference profiles not currently supported.

- `amazon-bedrock/meta.llama3-8b-instruct-v1:0`
- `amazon-bedrock/meta.llama3-70b-instruct-v1:0`

### Amazon Nova Models (1 model)

**Note:** Only the micro variant is functional. Larger models (lite, pro, premier) experience timeouts.

- `amazon-bedrock/amazon.nova-micro-v1:0`

---

## Summary

- **Total Working Models:** 14
- **Success Rate:** 31% (14 out of 45 tested models)
- **Best Provider:** OpenCode (100% success rate)
- **Best AWS Provider:** Anthropic Claude (50% success rate)

---

*Last tested: Fri Nov 21 2025*  
*Test methodology: Simple prompt test with 30-second timeout*
