package com.shayari.vista.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.shayari.vista.NavGraphDirections
import com.shayari.vista.data.local.AppDatabase
import com.shayari.vista.data.remote.RetrofitClient
import com.shayari.vista.data.repository.ShayariRepository
import com.shayari.vista.databinding.FragmentHomeBinding
import com.shayari.vista.util.ViewModelFactory

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: HomeViewModel
    private lateinit var shayariAdapter: ShayariAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
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
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = shayariAdapter
        }

        // Setup ViewModel
        val repository = ShayariRepository(
            RetrofitClient.apiService,
            AppDatabase.getDatabase(requireContext()).favoriteDao()
        )
        val factory = ViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory).get(HomeViewModel::class.java)

        // Observe LiveData
        viewModel.shayaris.observe(viewLifecycleOwner) { shayaris ->
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
