# Assets Atualizados - Página Quem Somos

## 📸 Imagens Necessárias

### Nossa História
- **Path**: `/public/images/about/founder-team.jpg`
- **Dimensões**: 800x600px (aspect-ratio 4:3)
- **Descrição**: Ricardo (fundador) em ação guiando ou com grupo de turistas
- **Formato**: JPG otimizado (< 200KB)

### Guia Credenciado (NOVO)
- **Path**: `/public/images/about/guide-ricardo.jpg`
- **Dimensões**: 400x400px (1:1 - formato circular)
- **Descrição**: Foto profissional do Ricardo (headshot)
- **Formato**: JPG ou PNG (< 150KB)
- **Observação**: Será exibida em círculo, então centralize o rosto

### Selo Cadastur
- **Path**: `/public/images/seals/cadastur-official.png`
- **Dimensões**: 400x400px
- **Descrição**: Selo oficial do Cadastur
- **Formato**: PNG com fundo transparente

---

## 🎨 Ícones (Lucide Icons - Já Incluídos)

✅ **Não é necessário criar SVGs customizados**. Os ícones já estão implementados via Lucide React:
- `Car` - Veículos vistoriados
- `ShieldCheck` - Seguro passageiros
- `Clock` - Pontualidade
- `CheckCircle2` - Checkmarks

---

## 📋 Checklist de Upload

### Essenciais
- [ ] `/images/about/founder-team.jpg` - Foto história (800x600)
- [ ] `/images/about/guide-ricardo.jpg` - Foto guia (400x400)
- [ ] `/images/seals/cadastur-official.png` - Selo Cadastur (400x400)

**Total**: 3 imagens

---

## � Dados a Personalizar

### No arquivo `pt.json` (linha 195):
```json
"cadasturNumber": "12.345678.90.0001-2"
```
**Substitua** pelo número real do Cadastur da empresa.

### No arquivo `pt.json` (linhas 201-206):
```json
"guide": {
    "name": "Ricardo Francisco",
    "cadasturNumber": "12.345678",
    "credential": "Credencial nº 987654"
}
```
**Substitua** pelo nome e credenciais reais do guia.

---

## 🚀 Como Adicionar os Assets

```bash
# Coloque as imagens nos diretórios:
public/images/about/
public/images/seals/
```

Depois de adicionar, a página automaticamente carregará os assets.

---

## ✅ Próximos Passos

1. **Upload das 3 imagens** nos paths especificados
2. **Atualizar traduções** com dados reais (Cadastur, nome do guia)
3. **Testar visualmente** em Desktop e Mobile
