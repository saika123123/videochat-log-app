import SpeechList from '../../../components/SpeechList'
import prisma from '../../../lib/prisma'


export default async function MeetingSpeechPage({ params }) {
    const speeches = await prisma.speech.findMany({
        where: {
            meetingId: params.meetingId
        },
        orderBy: {
            timestamp: 'asc'
        },
        include: {
            meeting: true,
            user: true
        }
    })

    const meeting = await prisma.meeting.findUnique({
        where: {
            id: params.meetingId
        }
    })

    if (!meeting) {
        return <div>ミーティングが見つかりません</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{meeting.title}</h1>
            <p className="text-gray-600 mb-6">
                {new Date(meeting.date).toLocaleDateString('ja-JP')}
            </p>
            <SpeechList speeches={speeches} />
        </div>
    )
}