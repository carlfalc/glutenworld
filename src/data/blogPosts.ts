export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "hidden-gluten-ingredients-list",
    title: "Hidden Gluten Ingredients List: What to Watch Out For",
    excerpt: "A comprehensive guide to identifying hidden sources of gluten in everyday foods and products that might surprise you.",
    content: `
# Hidden Gluten Ingredients List: What to Watch Out For

Living gluten-free can be challenging, especially when gluten hides in unexpected places. This comprehensive guide will help you identify hidden sources of gluten in everyday foods and products.

## Common Hidden Gluten Sources

### Food Additives & Flavorings
- **Natural flavoring** - May contain barley malt
- **Artificial flavoring** - Can contain gluten-based ingredients
- **Caramel color** - Sometimes made from barley
- **Modified food starch** - May be wheat-based unless specified
- **Hydrolyzed vegetable protein** - Often wheat-based

### Processed Meats
- **Sausages and hot dogs** - Often contain wheat as filler
- **Deli meats** - May have gluten-containing seasonings
- **Imitation crab meat** - Contains wheat starch
- **Meatballs** - Usually contain breadcrumbs
- **Marinated meats** - Marinades may contain soy sauce or wheat

### Sauces & Condiments
- **Soy sauce** - Traditional versions contain wheat
- **Teriyaki sauce** - Contains soy sauce
- **Salad dressings** - May contain wheat as thickener
- **Ketchup** - Some brands use wheat-based vinegar
- **BBQ sauce** - Often contains soy sauce or wheat

### Beverages
- **Beer** - Made from barley, wheat, or rye
- **Malt beverages** - Contain barley malt
- **Some wine coolers** - May contain barley malt
- **Flavored coffee** - Flavorings may contain gluten
- **Hot chocolate mixes** - May contain wheat flour

### Dairy Products
- **Blue cheese** - May be made with bread cultures
- **Flavored yogurt** - Thickeners may contain gluten
- **Ice cream** - Cookie pieces, cake pieces
- **Cheese spreads** - May contain wheat flour

### Snacks & Sweets
- **Candy** - May contain wheat flour or barley malt
- **Chocolate bars** - Often contain wheat or barley
- **Licorice** - Usually contains wheat flour
- **Energy bars** - Often contain wheat or oats
- **Trail mix** - Check for wheat-containing ingredients

### Unexpected Sources
- **Soup** - Thickeners may be wheat-based
- **Spice blends** - May contain wheat flour as anti-caking agent
- **Pickles** - Some contain wheat-based vinegar
- **French fries** - May be dusted with wheat flour
- **Egg substitute** - Some contain wheat

## Reading Labels Effectively

### Key Terms to Watch For
- Wheat, barley, rye, spelt, kamut, triticale
- Malt (barley malt, malt extract, malt flavoring)
- Brewer's yeast
- Wheat starch (unless labeled gluten-free)
- Hydrolyzed wheat protein

### Safe Alternatives
- Rice flour
- Corn starch
- Potato starch
- Coconut flour
- Almond flour
- Certified gluten-free oats

## Cross-Contamination Risks

Even naturally gluten-free foods can become contaminated:
- **Shared facilities** - Foods processed in facilities that also process wheat
- **Shared equipment** - Fryers, cutting boards, toasters
- **Bulk bins** - Cross-contamination from scoops and storage

## Tips for Safe Shopping

1. **Always read labels** - Even on products you've bought before
2. **Look for certification** - Certified gluten-free symbols
3. **Contact manufacturers** - When in doubt, call the company
4. **Shop dedicated sections** - Many stores have gluten-free sections
5. **Use apps** - Gluten-free product scanner apps can help

## Emergency Kit Essentials

Keep these gluten-free staples on hand:
- Certified gluten-free bread
- Rice cakes
- Nut butters
- Fresh fruits and vegetables
- Plain rice and quinoa
- Gluten-free pasta

## Conclusion

Being vigilant about hidden gluten sources is essential for maintaining a truly gluten-free diet. When in doubt, choose whole, unprocessed foods or products specifically labeled as gluten-free. Remember, your health is worth the extra effort in reading labels and researching ingredients.

*Always consult with a healthcare professional or registered dietitian for personalized advice regarding your gluten-free diet.*
    `,
    author: "Gluten World Team",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    tags: ["Gluten-Free", "Hidden Ingredients", "Food Safety", "Diet Tips"],
    featured: true
  }
];