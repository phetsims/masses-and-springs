// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/MassNode' );
  var SpringNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/SpringNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {MassesAndSpringsModel} massesAndSpringsModel
   * @constructor
   */
  function MassesAndSpringsScreenView( model ) {
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768 * 1.5, 504 * 1.5
    ) } );

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .9 ),
      1000 );
    this.mvt = mvt; // Make mvt available to descendant types.

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

//    var massNode = new MassNode( model.masses[0], mvt );
    model.masses.forEach( function ( mass ) {
      self.addChild( new MassNode( mass, mvt) );
    } );
    model.springs.forEach( function ( spring ) {
      self.addChild( new SpringNode( spring, mvt) );
    } );


    //
    //console.log("self center at (" + self.centerX + ", " + self.centerY + ")");
    //console.log("mass at (" + massNode.centerX + ", " + massNode.centerY + ")");
    //console.log("spring at (" + springNode.centerX + ", " + springNode.centerY + ")");



    // FROM BAIntroView TODO Apapt to MAS
    //model.massList.forEach( function( mass ) {
    //  // Add a listener for when the user drops the mass.  This is done here
    //  // in this case, rather than in the model, because we need to check
    //  // whether or not the user dropped it on the "stage" so that it isn't
    //  // permanently dragged off of the screen.
    //  mass.userControlledProperty.lazyLink( function( userControlled ) {
    //    if ( !userControlled ) {
    //      // The user has dropped this mass.
    //      if ( !model.plank.addMassToSurface( mass ) ) {
    //        // The attempt to add mass to surface of plank failed,
    //        // probably because mass was dropped somewhere other
    //        // than over the plank.
    //        if ( thisScreen.mvt.modelToViewX( mass.position.x ) > thisScreen.layoutBounds.minX && thisScreen.mvt.modelToViewX( mass.position.x ) < thisScreen.layoutBounds.maxX ) {
    //          // Mass is in the visible area, so just
    //          // drop it on the ground.
    //          mass.position = new Vector2( mass.position.x, 0 );
    //        }
    //        else {
    //          // Mass is off stage.  Return it to its original position.
    //          mass.positionProperty.reset();
    //        }
    //      }
    //    }
    //  } );
    //} );


  }

  massesAndSprings.register( 'MassesAndSpringsScreenView', MassesAndSpringsScreenView );

  return inherit( ScreenView, MassesAndSpringsScreenView, {


    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
      //model.step(dt);
    }
  } );
} );