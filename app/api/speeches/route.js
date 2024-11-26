// app/api/speeches/route.js
import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const date = searchParams.get('day')
        const userName = searchParams.get('userName') // userIdの代わりにuserNameを使用
        const meetingId = searchParams.get('meeting')

        console.log('Received params:', { search, date, userName, meetingId })

        let where = {}

        if (search) {
            where.content = {
                contains: search
            }
        }

        // userNameパラメータが存在する場合、ユーザー名で検索
        if (userName) {
            where.user = {
                name: {
                    contains: userName
                }
            }
        }

        if (meetingId) {
            where.meetingId = meetingId
        }

        if (date) {
            const startDate = new Date(date)
            const endDate = new Date(date)
            endDate.setDate(endDate.getDate() + 1)

            where.timestamp = {
                gte: startDate,
                lt: endDate
            }
        }

        const speeches = await prisma.speech.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                meeting: {
                    select: {
                        id: true,
                        title: true,
                        startTime: true,
                        room: {
                            select: {
                                id: true,
                                backgroundUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        })

        console.log(`Found ${speeches.length} speeches`)
        return NextResponse.json(speeches)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                error: 'データの取得に失敗しました',
                details: error.message
            },
            {
                status: 500
            }
        )
    }
}