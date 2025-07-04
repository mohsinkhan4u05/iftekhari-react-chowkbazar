import { useLanguagesBookQuery } from "@framework/language/get-all-languages-books";
import { CheckBox } from "@components/ui/checkbox";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

export const LanguageFilter = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { pathname, query } = router;
  const { data, isLoading } = useLanguagesBookQuery({
    limit: 15,
  });

  const selectedLanguages = query?.language
    ? (query.language as string).split(",")
    : [];
  const [formState, setFormState] =
    React.useState<string[]>(selectedLanguages);

  React.useEffect(() => {
    setFormState(selectedLanguages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query?.language]);

  if (isLoading) return <p>Loading...</p>;

  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    let currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value)
      : [...formState, value];
    const { language, ...restQuery } = query;
    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { language: currentFormState.join(",") }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }
  const items = data?.languages.data;
  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        Language
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {items?.map((item: any) => (
          <CheckBox
            key={item?.ID}
            label={`${item?.Name} (${item?.productCount})`}
            name={item?.Name?.toLowerCase()}
            checked={formState.includes(item?.Name)}
            value={item?.Name}
            onChange={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
};
