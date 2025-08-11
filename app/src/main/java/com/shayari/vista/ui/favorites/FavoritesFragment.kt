package com.shayari.vista.ui.favorites

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
import com.shayari.vista.databinding.FragmentFavoritesBinding
import com.shayari.vista.ui.home.ShayariAdapter
import com.shayari.vista.util.ViewModelFactory

class FavoritesFragment : Fragment() {

    private var _binding: FragmentFavoritesBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: FavoritesViewModel
    private lateinit var shayariAdapter: ShayariAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFavoritesBinding.inflate(inflater, container, false)
        val view = binding.root

        // Setup RecyclerView
        shayariAdapter = ShayariAdapter(emptyList(),
            onItemClicked = { shayari ->
                val action = NavGraphDirections.actionGlobalPoetDetail(shayari.poetId)
                findNavController().navigate(action)
            },
            onFavoriteClicked = { shayari ->
                // In the favorites screen, we should only be able to remove favorites.
                // I will implement this later. For now, I'll leave it empty.
            }
        )
        binding.recyclerViewFavorites.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = shayariAdapter
        }

        // Setup ViewModel
        val repository = ShayariRepository(
            RetrofitClient.apiService,
            AppDatabase.getDatabase(requireContext()).favoriteDao()
        )
        val factory = ViewModelFactory(repository)
        viewModel = ViewModelProvider(this, factory).get(FavoritesViewModel::class.java)

        // Observe LiveData
        viewModel.favoriteShayaris.observe(viewLifecycleOwner) { shayaris ->
            shayariAdapter.updateData(shayaris)
        }

        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
