import { useSearchParams, useNavigate } from 'react-router';
import TomographyView from './Forms/components/tomographyView';

export default function StudyViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orthancStudyId = searchParams.get('orthancStudyId') ?? undefined;
  const title  = searchParams.get('title')  || 'Estudio médico';
  const date   = searchParams.get('date')   || '—';
  const desc   = searchParams.get('desc')   || '';

  return (
    <div className="h-[calc(100vh-4rem)]">
      <TomographyView
        tomography={{ title, date, description: desc, orthancStudyId }}
        onBack={() => navigate(-1)}
      />
    </div>
  );
}
