import { useState } from 'react';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import { Button, SingleSelect, SingleSelectOption, Field, Typography } from '@strapi/design-system';
import { styled } from 'styled-components';
import { useVoice } from './useVoice';

interface Paragraph {
  id: number;
  original: string;
  translated: Translated[];
}

interface Translated {
  id: number;
  language: string;
  content: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
`;

interface Option {
  label: string;
  value: string;
}

export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce((flat: T[], toFlatten: T | T[]): T[] => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const Input = (props: any) => {
  const { name, attribute, onChange, value } = props;
  const { loading, convertToVoice } = useVoice();
  const { form } = useContentManagerContext();
  const [lang, setLang] = useState('');
  const { values, initialValues } = form;
  const isEditMode = !!Object.keys(initialValues).length;
  const paragraphs: Paragraph[] = values?.paragraphs ?? [];

  const getOptions = (): Option[] => {
    const languages = flatten(paragraphs?.map((p) => p.translated?.map((t) => t.language) ?? []));
    const convertedList = Array.from(new Set(languages)) as string[];
    return convertedList?.map((language) => ({ label: language, value: language })) ?? [];
  };

  const options = getOptions();

  const handleChange = (value: string) => {
    onChange({
      target: { name, type: attribute.type, value },
    });
  };

  const handleClick = async () => {
    const contents = flatten(
      paragraphs.map(
        (p) => p.translated.filter((t) => t.language === lang)?.map((t) => t.content) ?? []
      )
    );

    // Remove 2 dots
    const text = contents.join('. ').replace(/\.{2}/g, '.');
    const slug = values?.slug ?? '';

    if (!text || !slug) {
      return;
    }

    const body = { slug, text };
    const data = await convertToVoice(body);
    if (data) {
      handleChange(data);
    }
  };

  return (
    <Field.Root id={name}>
      <Field.Label>{name}</Field.Label>
      <Wrapper>
        <Action>
          <Button onClick={handleClick} disabled={!lang || !isEditMode} loading={loading}>
            Text to Speech
          </Button>
          <SingleSelect placeholder="Choose language" value={lang} onChange={setLang}>
            {options?.map((option: Option) => (
              <SingleSelectOption key={option.value} value={option.value}>
                {option.label}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </Action>
        {value && (
          <audio src={value} controls>
            Your browser does not support the audio element.
          </audio>
        )}
      </Wrapper>
    </Field.Root>
  );
};

export default Input;
