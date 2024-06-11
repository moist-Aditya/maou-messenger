import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Message } from "@/models/User.models"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

const MessageCard = ({
  message,
  handleDelete,
}: {
  message: Message
  handleDelete: (messageId: string) => void
}) => {
  const onDeleteMessageConfirm = async () => {
    handleDelete(message._id as string)
    const result = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    )

    if (result.data.success) {
      toast.success(result.data.message)
    } else {
      toast.error(result.data.message)
    }
  }

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>{message.content}</CardContent>
      <CardFooter>
        <div>
          <p className="text-xs text-slate-500">
            createdAt: {new Date(message.createdAt).toLocaleString()}
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex justify-center items-center bg-red-600 absolute p-2 w-8 h-8 rounded-md top-4 right-4">
                {/* <li className="bg-red-800 text-white transition-all font-bold text-sm p-2 rounded-md absolute top-4 right-4">
                  X
                </li> */}
                <span>X</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDeleteMessageConfirm}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MessageCard
