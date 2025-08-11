package com.shayari.vista.ui.search

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.shayari.vista.NavGraphDirections
import com.shayari.vista.data.local.AppDatabase
import com.shayari.vista.data.remote.RetrofitClient
import com.shayari.vista.data.repository.ShayariRepository
import com.shayari.vista.databinding.FragmentSearchBinding
import com.shayari.vista.ui.home.ShayariAdapter
import com.shayari.vista.util.ViewModelFactory

class SearchFragment : Fragment() {

    private var _binding: FragmentSearchBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: SearchViewModel
    private lateinit var shayariAdapter: ShayariAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSearchBinding.inflate(inflater, container, false)
        val view = binding.root

        // Setup RecyclerView
        shayariAdapter = ShayariAdapter(emptyList(),
            onItemClicked = { shayari ->
                val action = NavGraphDirections.actionGlobalPoetDetail(shayari.poetId)
                findNavController().navigate(action)
            },
            onFavoriteClicked = { shayari, isFavorite ->
                if (isFavorite) {
                    viewModel.removeFavorite(shayari)
                } else {
                    viewModel.addFavorite(shayari)
                }
            }
        )
        binding.recyclerViewSearch.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = shayariAdapter
        }

        // Setup ViewModel
        val repository = ShayariRepository(
            RetrofitClient.apiService,
            AppDatabase.getDatabase(requireContext()).favoriteDao()
        )
        val factory = ViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory).get(SearchViewModel::class.java)

        // Setup Search EditText
        binding.searchEditText.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                val query = binding.searchEditText.text.toString()
                if (query.isNotEmpty()) {
                    viewModel.search(query)
                }
                return@setOnEditorActionListener true
            }
            false
        }

        // Observe LiveData
        viewModel.searchResults.observe(viewLifecycleOwner) { shayaris ->
            shayariAdapter.updateData(shayaris)
        }

        viewModel.favorites.observe(viewLifecycleOwner) { favorites ->
            shayariAdapter.setFavorites(favorites.map { it.id }.toSet())
        }

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
