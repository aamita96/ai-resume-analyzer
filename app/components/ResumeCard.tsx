import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const imageReads = new Map<string, Promise<Blob | undefined>>();

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath, resumePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        let cancelled = false;
        let objectUrl = '';

        const loadResume = async () => {
            try {
                let imageRead = imageReads.get(imagePath);
                if (!imageRead) {
                    imageRead = fs.read(imagePath);
                    imageReads.set(imagePath, imageRead);
                }

                const blob = await imageRead;
                if (!blob || cancelled) return;

                objectUrl = URL.createObjectURL(blob);
                setResumeUrl(objectUrl);
            } catch (error) {
                if (!cancelled) console.error('Failed to load resume image', error);
            }
        }

        loadResume();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [imagePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl &&
                (<div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img src={resumeUrl} alt="resume" className="w-full h-[350px] max-sm:h-[200px] object-cover object-top" />
                    </div>
                </div>
                )}
        </Link>
    )
}

export default ResumeCard;