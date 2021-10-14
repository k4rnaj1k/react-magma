/**
 * HELPFUL NOTE!
 * SINCE THIS PACKAGE USES `FILE` WE MUST USE `Object.assign` IN LIEU OF SPREADING
 * `{...file}` WILL NOT COPY ALL OF THE FILE PROPERTIES
 */

import * as React from 'react';
import {
  useDropzone,
  DropzoneOptions,
  DropzoneRootProps,
  FileRejection,
} from 'react-dropzone';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Flex,
  FlexBehavior,
  FlexProps,
  FormFieldContainer,
  FormFieldContainerBaseProps,
  I18nContext,
  I18nInterface,
  InverseContext,
  ThemeContext,
  ThemeInterface,
  styled,
  useGenerateId,
  useIsInverse,
} from 'react-magma-dom';

import { CloudUploadIcon } from 'react-magma-icons';
import { Preview } from './Preview';
import { FilePreview, FileError } from './FilePreview';

export interface OnSendFileProps {
  file: FilePreview;
  onError?: ({}: { errors: FileError[]; file: FilePreview }) => void;
  onFinish?: ({}: { file: FilePreview }) => void;
  onProgress?: ({}: { percent: number; file: FilePreview }) => void;
}

type DragState =
  | 'error'
  | 'dragAccept'
  | 'dragReject'
  | 'dragActive'
  | 'default';
export interface FileUploaderProps
  extends Omit<FormFieldContainerBaseProps, 'fieldId' | 'errorMessage'> {
  accept?: string | string[];
  disabled?: boolean;
  dropzoneOptions?: Partial<Omit<DropzoneOptions, 'onDrop'>>;
  helperMessage?: string;
  id?: string;
  maxFiles?: number;
  minFiles?: number;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  noDrag?: boolean;
  onDeleteFile?: (file: FilePreview) => void;
  onRemoveFile?: (file: FilePreview) => void;
  onSendFile?: (props: OnSendFileProps) => void;
  sendFiles?: boolean;
  showAcceptHelper?: boolean;
  testId?: string;
  thumbnails?: boolean;
}

const Container = styled(Flex)<
  DropzoneRootProps &
  FlexProps & {
    dragState?: DragState;
    noDrag?: boolean;
    isInverse?: boolean;
  }
>`
  flex-direction: column;
  align-items: ${({ noDrag }) => (noDrag ? 'left' : 'center')};
  justify-content: ${({ noDrag }) => (noDrag ? 'left' : 'center')};
  text-align: ${({ noDrag }) => (noDrag ? 'left' : 'center')};
  padding: ${({ noDrag }) => (noDrag ? '0px' : '24px')};
  border-radius: ${({ noDrag }) => (noDrag ? '0px' : '4px')};
  border: ${({ dragState = 'default', noDrag, theme, isInverse }) =>
    noDrag
      ? `0px`
      : dragState === 'dragReject' || dragState === 'error'
      ? isInverse
        ? `2px dashed ${theme.colors.dangerInverse}`
        : `2px dashed ${theme.colors.danger}`
      : dragState === 'dragActive'
      ? `2px dashed ${theme.colors.primary}`
      : dragState === 'dragAccept'
      ? `2px dashed ${theme.colors.success}`
      : `2px dashed ${theme.colors.neutral05}`};

  border-style: ${({ dragState = 'default' }) =>
    dragState === 'error' ? 'solid' : 'dashed'};
  background-color: ${({ theme, noDrag, isInverse }) =>
    noDrag
      ? 'transparent'
      : isInverse
      ? theme.colors.foundation
      : theme.colors.neutral07};
  outline: none;
  transition: ${({ noDrag }) => `border ${noDrag ? 0 : '.24s'} ease-in-out`};
`;

const HelperMessage = styled.span<{ isInverse?: boolean }>`
  color: ${({ theme, isInverse }) =>
    isInverse ? theme.colors.neutral08 : theme.colors.neutral03};
  display: block;
  font-size: 14px;
  margin: -8px 0 16px 0;
`;

const Wrapper = styled.div<{ isInverse?: boolean }>`
  color: ${({ theme, isInverse }) =>
    isInverse ? theme.colors.neutral07 : theme.colors.neutral02};
  margin: 0 0 24px 0;
  font-size: ${({ theme }) => theme.typeScale.size02.fontSize};
  line-height: ${({ theme }) => theme.typeScale.size02.lineHeight};
  font-weight: 600;
  padding: ${({ theme }) => theme.spaceScale.spacing01};
`;
export const FileUploader = React.forwardRef<
  HTMLInputElement,
  FileUploaderProps
>((props, ref) => {
  const {
    accept,
    containerStyle,
    disabled,
    dropzoneOptions = {
      multiple: true,
    },
    helperMessage,
    id: defaultId,
    inputSize,
    isInverse: isInverseProp,
    isLabelVisuallyHidden,
    labelStyle,
    labelText,
    maxFiles,
    minFiles,
    maxSize,
    minSize,
    multiple = true,
    noDrag = false,
    onSendFile,
    onDeleteFile,
    onRemoveFile,
    sendFiles = false,
    showAcceptHelper = true,
    testId,
    thumbnails = true,
    ...rest
  } = props;

  const [files, setFiles] = React.useState<FilePreview[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isInverse = useIsInverse(isInverseProp);
  const theme: ThemeInterface = React.useContext(ThemeContext);
  const i18n: I18nInterface = React.useContext(I18nContext);
  const id = useGenerateId(defaultId);

  const onDrop = React.useCallback(
    (acceptedFiles: FilePreview[], rejectedFiles: FileRejection[]) => {
      setFiles((files: FilePreview[]) => [
        ...files,
        ...acceptedFiles.map((file: FilePreview) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
        ...rejectedFiles.map(
          ({ file, errors }: { file: FilePreview; errors: FileError[] }) =>
            Object.assign(file, {
              errors,
            })
        ),
      ]);
    },
    []
  );

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    noClick: true,
    disabled,
    multiple,
    maxSize,
    minSize,
    accept,
    onDrop,
    noDrag,
  });

  const dragState: DragState = errorMessage
    ? 'error'
    : isDragAccept
    ? 'dragAccept'
    : isDragReject
    ? 'dragReject'
    : isDragActive
    ? 'dragActive'
    : 'default';

  const handleRemoveFile = (removedFile: FilePreview) => {
    setFiles(files => files.filter(file => file !== removedFile));
    if (onRemoveFile && typeof onRemoveFile === 'function') {
      onRemoveFile(removedFile);
    }
  };

  const handleDeleteFile = (removedFile: FilePreview) => {
    setFiles(files => files.filter(file => file !== removedFile));
    if (onDeleteFile && typeof onDeleteFile === 'function') {
      onDeleteFile(removedFile);
    }
  };

  const setProgress = (props: { percent: number; file: FilePreview }) => {
    setFiles(files =>
      files.map(file =>
        file === props.file
          ? Object.assign(file, {
              processor: {
                ...file.processor,
                percent: `${props.percent}%`,
                status: 'pending'
              },
            })
          : file
      )
    );
  };

  const setFinished = (props: { file: FilePreview }) => {
    setFiles(files =>
      files.map(file =>
        file === props.file
          ? Object.assign(file, {
              processor: { ...file.processor, percent: '', status: 'finished' },
            })
          : file
      )
    );
  };

  const setError = (props: { errors: FileError[]; file: FilePreview }) => {
    setFiles(files =>
      files.map(file =>
        file === props.file
          ? Object.assign(file, {
              errors: props.errors,
              processor: { ...file.processor, status: 'error' },
            })
          : file
      )
    );
  };

  const formatError = (
    code: string | null,
    constraints: { maxFiles?: number; minFiles?: number }
  ) => {
    if (code === null) return null;
    const error = i18n.fileUploader.errors[code];
    switch (code) {
      case 'too-many-files':
        return `${error.message} ${constraints.maxFiles} ${i18n.fileUploader.files}.`;
      case 'too-few-files':
        return `${error.message} ${constraints.minFiles} ${i18n.fileUploader.files}.`;
      default:
        return error.message;
    }
  };

  React.useEffect(
    () => () => {
      files.forEach(file => file.preview && URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  React.useEffect(() => {
    const minFileError = minFiles && files.length < minFiles;
    const maxFileError = maxFiles && files.length > maxFiles;

    setErrorMessage(
      formatError(
        maxFileError
          ? 'too-many-files'
          : minFileError
          ? 'too-few-files'
          : null,
        { minFiles, maxFiles }
      )
    );

    if (sendFiles && files.length > 0 && !maxFileError && !minFileError) {
      setFiles((files: FilePreview[]) => {
        return files.map((file: FilePreview) => {
          !file.errors && ! file.processor && onSendFile && onSendFile({
            file,
            onError: setError,
            onFinish: setFinished,
            onProgress: setProgress,
          })
          return file;
        });
      });
    }
  }, [sendFiles, files.length, onSendFile]);

  return (
    <InverseContext.Provider value={{ isInverse }}>
      <FormFieldContainer
        containerStyle={containerStyle}
        errorMessage={errorMessage}
        fieldId={id}
        inputSize={inputSize}
        isInverse={isInverse}
        isLabelVisuallyHidden={isLabelVisuallyHidden}
        labelStyle={labelStyle}
        labelText={labelText}
        messageStyle={{ minHeight: 0 }}
        data-testid={testId}
      >
        <HelperMessage theme={theme} isInverse={isInverse}>
          {helperMessage}
        </HelperMessage>
        <Container
          behavior={FlexBehavior.container}
          dragState={dragState}
          isInverse={isInverse}
          noDrag={noDrag}
          theme={theme}
          {...getRootProps()}
          {...rest}
          testId={testId}
        >
          <input ref={ref} {...getInputProps({id})} />
          {noDrag ? (
            <Flex xs behavior={FlexBehavior.item}>
              <Button
                color={ButtonColor.primary}
                disabled={disabled}
                isInverse={isInverse}
                onClick={open}
                style={{ margin: 0 }}
              >
                {i18n.fileUploader.browseFiles}
              </Button>
            </Flex>
          ) : (
            <Flex behavior={FlexBehavior.item}>
              <CloudUploadIcon
                aria-hidden="true"
                color={
                  isInverse ? theme.colors.neutral07 : theme.colors.neutral02
                }
                size={48}
              />
              <Wrapper isInverse={isInverse} theme={theme}>
                {i18n.fileUploader.dragMessage}
              </Wrapper>
              <Button
                color={ButtonColor.secondary}
                disabled={disabled}
                isInverse={isInverse}
                onClick={open}
                style={{ margin: 0 }}
                variant={ButtonVariant.solid}
              >
                {i18n.fileUploader.browseFiles}
              </Button>
            </Flex>
          )}
        </Container>
      </FormFieldContainer>
      {files.map((file: FilePreview) => (
        <Preview
          accept={accept}
          file={file}
          isInverse={isInverse}
          key={file.name}
          maxSize={maxSize}
          minSize={minSize}
          onDeleteFile={handleDeleteFile}
          onRemoveFile={handleRemoveFile}
          thumbnails={thumbnails}
        />
      ))}
    </InverseContext.Provider>
  );
});
