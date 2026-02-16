<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseArticle;
use App\Models\KnowledgeBaseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class KnowledgeBaseController extends Controller
{
    public function list(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $category_id = trim((string) $request->query('category_id', ''));

        $query = KnowledgeBaseArticle::query()->with('category')->orderByDesc('created_at');

        if ($q !== '') {
            $query->where(function($q2) use ($q) {
                $q2->where('title', 'like', "%{$q}%")
                   ->orWhere('content', 'like', "%{$q}%");
            });
        }

        if ($category_id !== '') {
            $query->where('category_id', $category_id);
        }

        return response()->json([
            'articles' => $query->get(),
            'categories' => KnowledgeBaseCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:knowledge_base_categories,id'],
            'is_published' => ['boolean'],
        ]);

        $article = KnowledgeBaseArticle::create($validated);

        return response()->json([
            'created' => true,
            'article' => $article,
        ]);
    }

    public function update(Request $request, KnowledgeBaseArticle $article)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:knowledge_base_categories,id'],
            'is_published' => ['boolean'],
        ]);

        $article->update($validated);

        return response()->json([
            'updated' => true,
            'article' => $article,
        ]);
    }

    public function destroy(KnowledgeBaseArticle $article)
    {
        $article->delete();
        return response()->json(['deleted' => true]);
    }

    public function listCategories()
    {
        return response()->json([
            'categories' => KnowledgeBaseCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:knowledge_base_categories,name'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $category = KnowledgeBaseCategory::create($validated);

        return response()->json([
            'created' => true,
            'category' => $category,
        ]);
    }

    public function destroyCategory(KnowledgeBaseCategory $category)
    {
        $category->delete();
        return response()->json(['deleted' => true]);
    }
}
