import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
interface ConfirmModalProps {
  children: React.ReactNode;
  title: React.ReactNode;
  confirmFc: () => void;
  loading?: boolean;
}
export default function ConfirmModal({ children, confirmFc, title, loading }: ConfirmModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} size={'auto'}>
        <div className="p-6 w-[300px] text-center">Are you sure?</div>
        <div className="mt-4 flex justify-center gap-2 items-center">
          <Button variant="outline" size="sm" onClick={close}>
            No
          </Button>
          <Button
            onClick={() => {
              close();
              confirmFc();
            }}
            size="sm"
            disabled={loading}
            loading={loading}
          >
            Yes
          </Button>
        </div>
      </Modal>
      <button
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        {children}
      </button>
    </>
  );
}
