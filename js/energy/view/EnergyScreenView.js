// Copyright 2017-2020, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import OneSpringScreenView from '../../common/view/OneSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';

/**
 * @param {EnergyModel} model
 * @param {Tandem} tandem
 *
 * @constructor
 */
function EnergyScreenView( model, tandem ) {

  // Calls common spring view
  OneSpringScreenView.call( this, model, tandem, {
    dampingVisible: true
  } );
  const self = this;

  // Contains visibility options for the reference lines and displacement arrow
  const indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

  // VBox that contains all of the panel's content
  const optionsVBox = new VBox( {
    spacing: 10,
    children: [
      indicatorVisibilityControlNode,
      MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
      this.gravityAndDampingControlNode
    ]
  } );

  // Panel that will display all the toggleable options.
  const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

  // Contains all of the options for the reference lines, gravity, damping, and toolbox
  const rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing * 0.9 } );
  this.addChild( rightPanelsVBox );
  rightPanelsVBox.moveToBack();


  this.visibleBoundsProperty.link( function() {
    rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.energyGraphNode.top );
  } );

  this.shelf.rectWidth = 140;
  this.shelf.left = this.energyGraphNode.right + this.spacing;

  // Move this plane to the back of the scene graph
  this.backgroundDragPlane.moveToBack();
}

massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

inherit( OneSpringScreenView, EnergyScreenView );
export default EnergyScreenView;