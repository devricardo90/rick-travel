# Logo Rick Travel

Componente de logo da Rick Travel seguindo as melhores práticas do Next.js e React.

## 📁 Localização

O componente está localizado em:
```
components/rick-travel-logo.tsx
```

## 🚀 Como Usar

### Importação Básica

```tsx
import { RickTravelLogo } from '@/components/rick-travel-logo'
// ou através do index
import { RickTravelLogo } from '@/components'
```

### Variantes Disponíveis

#### 1. Logo Completo (Full)
Ícone + texto "RICK TRAVEL"

```tsx
<RickTravelLogo variant="full" size="md" />
```

#### 2. Apenas Ícone
Apenas o círculo com o globo e palmeira

```tsx
<RickTravelLogo variant="icon" size="sm" />
// ou use o componente simplificado
import { RickTravelLogoIcon } from '@/components/rick-travel-logo'
<RickTravelLogoIcon />
```

#### 3. Apenas Texto
Apenas o texto "RICK TRAVEL"

```tsx
<RickTravelLogo variant="text" size="md" />
// ou use o componente simplificado
import { RickTravelLogoText } from '@/components/rick-travel-logo'
<RickTravelLogoText />
```

### Tamanhos

- `sm` - Pequeno (recomendado para header/mobile)
- `md` - Médio (padrão)
- `lg` - Grande (recomendado para hero sections)

### Exemplos de Uso

#### Header (Pequeno)
```tsx
<Link href="/">
  <RickTravelLogo variant="full" size="sm" />
</Link>
```

#### Hero Section (Grande)
```tsx
<div className="flex flex-col items-center">
  <RickTravelLogo variant="full" size="lg" />
  <h1>City Tour no Rio de Janeiro</h1>
</div>
```

#### Footer (Médio)
```tsx
<RickTravelLogo variant="full" size="md" />
```

#### Favicon ou Ícone Simples
```tsx
<RickTravelLogoIcon className="h-6 w-6" />
```

## 🎨 Design

O logo consiste em:
- **Ícone Circular**: Globo Terra com palmeira em um círculo verde com borda amarela
- **Texto**: "RICK" em azul (#2196F3) e "TRAVEL" em amarelo (#FFD700)
- **Cores**:
  - Azul: #2196F3 (RICK)
  - Amarelo: #FFD700 (TRAVEL, borda)
  - Verde: #0d5d31 (fundo)
  - Verde claro: #4CAF50, #66BB6A (palmeira, ondas)

## ✨ Características

- ✅ **SVG Scalable**: Vetorial, nítido em qualquer tamanho
- ✅ **TypeScript**: Totalmente tipado
- ✅ **Acessível**: Inclui `aria-label` e `role="img"`
- ✅ **Responsivo**: Adapta-se a diferentes tamanhos de tela
- ✅ **Dark Mode Ready**: Compatível com temas claro/escuro
- ✅ **Performance**: SVG inline, sem requisições externas

## 📝 Notas

- O componente usa `cn()` do Tailwind para classes condicionais
- A fonte do texto usa Inter (já configurada no projeto)
- Todos os elementos SVG são otimizados para performance

## 🔄 Atualização

Para atualizar o logo no futuro:
1. Edite o arquivo `components/rick-travel-logo.tsx`
2. Os componentes que já usam o logo serão atualizados automaticamente


