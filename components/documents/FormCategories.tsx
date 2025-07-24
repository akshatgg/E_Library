"use client";

interface FormCategory {
  [key: string]: string[];
}

interface FormCategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onFormSelect: (form: string) => void;
  selectedTab: string;
}

export default function FormCategories({
  selectedCategory,
  setSelectedCategory,
  onFormSelect,
  selectedTab,
}: FormCategoriesProps) {
  // Simplified form categories - same for all tabs but with tab-specific forms
  const getFormCategories = (tabId: string): FormCategory => {
    const baseCategories = {
      Refund: [
        `${tabId} Refund Application`,
        "Excess Payment Refund",
        "Credit Refund",
        "Advance Payment Refund",
      ],
      Assessment: [
        "Self Assessment",
        "Regular Assessment",
        "Best Judgement Assessment",
        "Reassessment Application",
      ],
      Appeal: [
        "Appeal Filing",
        "Appeal Effect Request",
        "Cross Appeal",
        "Appeal Modification",
      ],
      Compliance: [
        "Return Filing",
        "Compliance Certificate",
        "Audit Report",
        "Documentation",
      ],
      General: [
        "General Application",
        "Miscellaneous Request",
        "Information Request",
        "Authorization Letter",
      ],
      Rectification: [
        "Error Correction",
        "Computational Error",
        "Clerical Mistake Correction",
        "Amendment Application",
      ],
    };

    return baseCategories;
  };

  const formCategories = getFormCategories(selectedTab);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        {selectedTab} Department - Form Categories
      </h2>

      {/* Category Tabs */}
      <div className="border-b border-slate-200 mb-4">
        <div className="flex flex-wrap gap-1">
          {Object.keys(formCategories).map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                selectedCategory === category
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {category.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Forms List */}
      {selectedCategory && (
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {selectedCategory.replace(/_/g, " ")} Forms - Click to Add to Documents List:
          </h3>
          <div className="max-h-40 overflow-y-auto border border-slate-200 bg-white rounded">
            {formCategories[selectedCategory]?.map((form: string) => (
              <button
                key={form}
                onClick={() => onFormSelect(form)}
                className="w-full px-3 py-2 text-left text-sm border-b border-slate-100 last:border-b-0 transition-colors hover:bg-blue-50 text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <span>{form}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Add to List
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            💡 Click any form above to add it to your Documents List. Then use the Documents List section to select and work with your forms.
          </div>
        </div>
      )}
    </div>
  );
}
