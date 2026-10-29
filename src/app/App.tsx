import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import { HomePage, RulesPage, DepartmentsPage, ShopPage, GalleryPage, ReportPage, MapPage, NotFoundPage } from '../pages/PublicPages';
const AdminPage=lazy(()=>import('../pages/AdminPage'));
const NewsPage=lazy(()=>import('../pages/PublicContentPages').then(module=>({default:module.NewsPage})));
const StaffPage=lazy(()=>import('../pages/PublicContentPages').then(module=>({default:module.StaffPage})));
function Loading(){return <main className="page-shell"><p>Loading page…</p></main>}
export default function App(){return <Routes><Route path="/admin" element={<Suspense fallback={<main className="admin-shell"><p>Loading secure admin…</p></main>}><AdminPage/></Suspense>}/><Route element={<PublicLayout/>}><Route path="/" element={<HomePage/>}/><Route path="/news" element={<Suspense fallback={<Loading/>}><NewsPage/></Suspense>}/><Route path="/rules" element={<RulesPage/>}/><Route path="/departments" element={<DepartmentsPage/>}/><Route path="/shop" element={<ShopPage/>}/><Route path="/staff" element={<Suspense fallback={<Loading/>}><StaffPage/></Suspense>}/><Route path="/gallery" element={<GalleryPage/>}/><Route path="/report" element={<ReportPage/>}/><Route path="/map" element={<MapPage/>}/><Route path="*" element={<NotFoundPage/>}/></Route></Routes>}
