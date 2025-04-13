# 🧠 AIDEN Interface

> The AI cockpit for defense strategy, genomic augmentation, and mission-aligned recursion.

## 🧬 Features

- LangChain-powered AI memory w/ recursive thread hydration
- Role-based access to project logs, actions, and personas
- Live contract feed, project analytics, risk profiles
- Voice-activated command console (Whisper + TTS)
- Hotkey-driven UI, tactical command bar (`/launch`, `/elevate`, `/readback`)

## 🛠️ Setup

1. `git clone https://github.com/agiledefensesystems/aiden-interface`
2. Configure `.env.local` with:
   - `NEXT_SUPABASE_URL`
   - `NEXT_SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `ELEVENLABS_API_KEY` (optional, for high-quality TTS)
3. `npm install && npm run dev`

## 🔐 Access Roles

| Role | Capabilities |
|------|--------------|
| Admin (Devin) | Full memory + deployment + audit logs |
| AIDEN | Execution, recursion, output |
| Clinician | View-only diagnostics & TTS readouts |
| Investor | Project overview, ROI charts |
| Mentor | Annotate memory threads |

## 🎤 Voice Activation

- Say: `"AIDEN, read my Spectra log from April 5th."`
- Press `R` to record, `M` to mute, `L` for last log playback.

## 📋 Memory Schema

The AIDEN Interface uses a sophisticated memory schema to store and retrieve contextual information:

\`\`\`typescript
export type MemoryThread = {
  id: string
  title: string
  contextStack: string[]
  emotionalTuning: 'neutral' | 'strategic' | 'introspective' | 'aggressive' | 'empathic'
  accessLevel: 'public' | 'private' | 'restricted'
  rolesAllowed: string[]
  lastInvoked: string
  memoryVectors: number[]
  content: string
  createdAt: string
  updatedAt: string
}
\`\`\`

## 🔄 Mode Switching

AIDEN supports different emotional tuning modes that affect how it processes and responds to information:

- **Neutral**: Balanced, objective analysis
- **Strategic**: Focus on long-term planning and optimization
- **Introspective**: Deep analysis and self-reflection
- **Aggressive**: Direct, action-oriented approach
- **Empathic**: Focus on human factors and emotional context

## 📊 Project Structure

\`\`\`
/
├── app/                # Next.js app router
│   ├── api/            # API routes for TTS, voice recognition
│   ├── page.tsx        # Main interface
│   └── layout.tsx      # Root layout
├── components/         # UI components
│   ├── CommandBar.tsx  # Command input interface
│   ├── MemoryView.tsx  # Memory thread viewer
│   ├── VoiceConsole.tsx # Voice interaction console
│   └── ui/             # UI primitives
├── lib/                # Core functionality
│   ├── aiden.ts        # AIDEN agent implementation
│   ├── tts.ts          # Text-to-speech functionality
│   ├── voice-recognition.ts # Voice recognition
│   └── memory/         # Memory management
└── public/             # Static assets
\`\`\`

## 📝 License

Proprietary - All rights reserved
\`\`\`

Let's create a package.json file:
